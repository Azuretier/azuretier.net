import { NextResponse } from 'next/server';
import type { DeploymentTag, TagsApiResponse } from '@/types/deployment';

interface GitHubTagResponse {
  name: string;
  commit: { sha: string; url: string };
}

interface VercelDeployment {
  url: string;
  meta?: { githubCommitSha?: string };
}

interface CachedData {
  data: TagsApiResponse;
  timestamp: number;
}

let cache: CachedData | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }

  try {
    const ghHeaders: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'azuretier.net',
    };

    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      ghHeaders.Authorization = `Bearer ${githubToken}`;
    }

    const ghRes = await fetch(
      'https://api.github.com/repos/Azuretier/azuretier.net/tags?per_page=20',
      { headers: ghHeaders, next: { revalidate: 300 } }
    );

    if (!ghRes.ok) {
      return NextResponse.json(
        { tags: [], currentSha: null } satisfies TagsApiResponse,
        { status: 200 }
      );
    }

    const ghTags: GitHubTagResponse[] = await ghRes.json();
    const currentSha = process.env.VERCEL_GIT_COMMIT_SHA || null;

    // Resolve deployment URLs
    let deploymentMap: Map<string, string> | null = null;
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;

    if (vercelToken && vercelProjectId) {
      try {
        const vRes = await fetch(
          `https://api.vercel.com/v6/deployments?projectId=${vercelProjectId}&limit=100`,
          { headers: { Authorization: `Bearer ${vercelToken}` } }
        );
        if (vRes.ok) {
          const vData: { deployments: VercelDeployment[] } = await vRes.json();
          deploymentMap = new Map();
          for (const d of vData.deployments) {
            if (d.meta?.githubCommitSha && d.url) {
              deploymentMap.set(d.meta.githubCommitSha, `https://${d.url}`);
            }
          }
        }
      } catch {
        // Vercel API failed, fall through to predictable URL
      }
    }

    const tags: DeploymentTag[] = ghTags.map((tag) => {
      let deploymentUrl: string | null = null;

      if (deploymentMap) {
        deploymentUrl = deploymentMap.get(tag.commit.sha) || null;
      } else {
        const projectName =
          process.env.VERCEL_PROJECT_NAME || 'azuretier-net';
        const teamSlug = process.env.VERCEL_TEAM_SLUG || 'azuretier';
        const sanitizedTag = tag.name
          .replace(/[/.@]/g, '-')
          .toLowerCase();
        deploymentUrl = `https://${projectName}-git-${sanitizedTag}-${teamSlug}.vercel.app`;
      }

      return {
        name: tag.name,
        sha: tag.commit.sha,
        deploymentUrl,
        isCurrent: currentSha ? tag.commit.sha === currentSha : false,
      };
    });

    const responseData: TagsApiResponse = { tags, currentSha };
    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[GITHUB_TAGS] Error:', error);
    return NextResponse.json(
      { tags: [], currentSha: null } satisfies TagsApiResponse,
      { status: 200 }
    );
  }
}
