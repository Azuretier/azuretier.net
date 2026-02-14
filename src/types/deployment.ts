export interface DeploymentTag {
  name: string;
  sha: string;
  deploymentUrl: string | null;
  isCurrent: boolean;
}

export interface TagsApiResponse {
  tags: DeploymentTag[];
  currentSha: string | null;
}
