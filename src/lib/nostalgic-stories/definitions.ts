export interface StoryScene {
    id: string;
    /** i18n key for character name */
    characterKey: string;
    /** i18n key for dialog text */
    dialogKey: string;
    /** CSS gradient / splash art config */
    splashArt: SplashArt;
}

export interface SplashArt {
    /** Primary background gradient */
    background: string;
    /** Overlay elements (stars, particles, etc.) */
    overlayType: 'stars' | 'rain' | 'embers' | 'none' | 'snow' | 'petals';
    /** Ambient color for the scene */
    ambientColor: string;
    /** Vignette intensity 0-1 */
    vignette: number;
}

export interface Story {
    id: string;
    /** i18n key for story title */
    titleKey: string;
    /** i18n key for story subtitle */
    subtitleKey: string;
    /** Badge/tag for the story */
    badge: string;
    /** Color accent for the card */
    accentColor: string;
    scenes: StoryScene[];
}

export const STORIES: Story[] = [
    {
        id: 'origin',
        titleKey: 'origin.title',
        subtitleKey: 'origin.subtitle',
        badge: 'CH.01',
        accentColor: '#7c3aed',
        scenes: [
            {
                id: 'origin-1',
                characterKey: 'origin.characters.narrator',
                dialogKey: 'origin.scenes.s1',
                splashArt: {
                    background: 'linear-gradient(180deg, #0a0015 0%, #1a0033 40%, #2d1b69 70%, #0a0015 100%)',
                    overlayType: 'stars',
                    ambientColor: '#7c3aed',
                    vignette: 0.7,
                },
            },
            {
                id: 'origin-2',
                characterKey: 'origin.characters.melodia',
                dialogKey: 'origin.scenes.s2',
                splashArt: {
                    background: 'linear-gradient(180deg, #0d001a 0%, #1a0044 30%, #3b0764 60%, #7c3aed 100%)',
                    overlayType: 'stars',
                    ambientColor: '#a78bfa',
                    vignette: 0.6,
                },
            },
            {
                id: 'origin-3',
                characterKey: 'origin.characters.narrator',
                dialogKey: 'origin.scenes.s3',
                splashArt: {
                    background: 'linear-gradient(180deg, #0f0520 0%, #1e0a3e 30%, #4a1d96 55%, #6d28d9 80%, #1e0a3e 100%)',
                    overlayType: 'embers',
                    ambientColor: '#c4b5fd',
                    vignette: 0.5,
                },
            },
            {
                id: 'origin-4',
                characterKey: 'origin.characters.melodia',
                dialogKey: 'origin.scenes.s4',
                splashArt: {
                    background: 'linear-gradient(180deg, #000011 0%, #0c0033 30%, #1e0066 50%, #5b21b6 75%, #7c3aed 100%)',
                    overlayType: 'stars',
                    ambientColor: '#ddd6fe',
                    vignette: 0.4,
                },
            },
            {
                id: 'origin-5',
                characterKey: 'origin.characters.narrator',
                dialogKey: 'origin.scenes.s5',
                splashArt: {
                    background: 'linear-gradient(180deg, #0a0020 0%, #1a0050 25%, #3b0d99 50%, #7c3aed 75%, #ddd6fe 100%)',
                    overlayType: 'embers',
                    ambientColor: '#ede9fe',
                    vignette: 0.3,
                },
            },
        ],
    },
    {
        id: 'silence',
        titleKey: 'silence.title',
        subtitleKey: 'silence.subtitle',
        badge: 'CH.02',
        accentColor: '#0ea5e9',
        scenes: [
            {
                id: 'silence-1',
                characterKey: 'silence.characters.wanderer',
                dialogKey: 'silence.scenes.s1',
                splashArt: {
                    background: 'linear-gradient(180deg, #000000 0%, #001122 30%, #002244 60%, #001122 100%)',
                    overlayType: 'snow',
                    ambientColor: '#38bdf8',
                    vignette: 0.8,
                },
            },
            {
                id: 'silence-2',
                characterKey: 'silence.characters.narrator',
                dialogKey: 'silence.scenes.s2',
                splashArt: {
                    background: 'linear-gradient(180deg, #000508 0%, #001520 30%, #002a40 50%, #003d5c 70%, #001520 100%)',
                    overlayType: 'snow',
                    ambientColor: '#7dd3fc',
                    vignette: 0.7,
                },
            },
            {
                id: 'silence-3',
                characterKey: 'silence.characters.wanderer',
                dialogKey: 'silence.scenes.s3',
                splashArt: {
                    background: 'linear-gradient(180deg, #000205 0%, #000d1a 25%, #0c4a6e 50%, #0284c7 75%, #000d1a 100%)',
                    overlayType: 'snow',
                    ambientColor: '#bae6fd',
                    vignette: 0.6,
                },
            },
            {
                id: 'silence-4',
                characterKey: 'silence.characters.echo',
                dialogKey: 'silence.scenes.s4',
                splashArt: {
                    background: 'linear-gradient(180deg, #000a14 0%, #001d33 25%, #0369a1 50%, #0ea5e9 70%, #bae6fd 100%)',
                    overlayType: 'none',
                    ambientColor: '#e0f2fe',
                    vignette: 0.4,
                },
            },
            {
                id: 'silence-5',
                characterKey: 'silence.characters.narrator',
                dialogKey: 'silence.scenes.s5',
                splashArt: {
                    background: 'linear-gradient(180deg, #000000 0%, #000814 30%, #001e3d 50%, #0c4a6e 70%, #0ea5e9 100%)',
                    overlayType: 'snow',
                    ambientColor: '#38bdf8',
                    vignette: 0.5,
                },
            },
        ],
    },
    {
        id: 'ember',
        titleKey: 'ember.title',
        subtitleKey: 'ember.subtitle',
        badge: 'CH.03',
        accentColor: '#f97316',
        scenes: [
            {
                id: 'ember-1',
                characterKey: 'ember.characters.keeper',
                dialogKey: 'ember.scenes.s1',
                splashArt: {
                    background: 'linear-gradient(180deg, #1a0a00 0%, #3d1500 30%, #7c2d12 55%, #ea580c 80%, #1a0a00 100%)',
                    overlayType: 'embers',
                    ambientColor: '#fb923c',
                    vignette: 0.6,
                },
            },
            {
                id: 'ember-2',
                characterKey: 'ember.characters.narrator',
                dialogKey: 'ember.scenes.s2',
                splashArt: {
                    background: 'linear-gradient(180deg, #0a0500 0%, #2d1200 25%, #9a3412 50%, #f97316 70%, #fbbf24 100%)',
                    overlayType: 'embers',
                    ambientColor: '#fdba74',
                    vignette: 0.5,
                },
            },
            {
                id: 'ember-3',
                characterKey: 'ember.characters.keeper',
                dialogKey: 'ember.scenes.s3',
                splashArt: {
                    background: 'linear-gradient(180deg, #1c0800 0%, #451a03 30%, #c2410c 55%, #f97316 75%, #fed7aa 100%)',
                    overlayType: 'embers',
                    ambientColor: '#ffedd5',
                    vignette: 0.4,
                },
            },
            {
                id: 'ember-4',
                characterKey: 'ember.characters.flame',
                dialogKey: 'ember.scenes.s4',
                splashArt: {
                    background: 'linear-gradient(180deg, #000000 0%, #1c0800 20%, #7c2d12 40%, #ea580c 60%, #fbbf24 80%, #fef3c7 100%)',
                    overlayType: 'embers',
                    ambientColor: '#fde68a',
                    vignette: 0.3,
                },
            },
            {
                id: 'ember-5',
                characterKey: 'ember.characters.narrator',
                dialogKey: 'ember.scenes.s5',
                splashArt: {
                    background: 'linear-gradient(180deg, #0a0500 0%, #3d1500 20%, #ea580c 50%, #f97316 70%, #0a0500 100%)',
                    overlayType: 'embers',
                    ambientColor: '#fb923c',
                    vignette: 0.6,
                },
            },
        ],
    },
    {
        id: 'bloom',
        titleKey: 'bloom.title',
        subtitleKey: 'bloom.subtitle',
        badge: 'CH.04',
        accentColor: '#ec4899',
        scenes: [
            {
                id: 'bloom-1',
                characterKey: 'bloom.characters.narrator',
                dialogKey: 'bloom.scenes.s1',
                splashArt: {
                    background: 'linear-gradient(180deg, #0a000a 0%, #1a001a 25%, #4a0e4e 50%, #831843 70%, #0a000a 100%)',
                    overlayType: 'petals',
                    ambientColor: '#f472b6',
                    vignette: 0.7,
                },
            },
            {
                id: 'bloom-2',
                characterKey: 'bloom.characters.sakura',
                dialogKey: 'bloom.scenes.s2',
                splashArt: {
                    background: 'linear-gradient(180deg, #0d000d 0%, #2e0028 20%, #831843 45%, #ec4899 65%, #fce7f3 100%)',
                    overlayType: 'petals',
                    ambientColor: '#f9a8d4',
                    vignette: 0.5,
                },
            },
            {
                id: 'bloom-3',
                characterKey: 'bloom.characters.narrator',
                dialogKey: 'bloom.scenes.s3',
                splashArt: {
                    background: 'linear-gradient(180deg, #0f000f 0%, #3b0030 20%, #9d174d 40%, #ec4899 60%, #fbcfe8 80%, #fdf2f8 100%)',
                    overlayType: 'petals',
                    ambientColor: '#fda4af',
                    vignette: 0.4,
                },
            },
            {
                id: 'bloom-4',
                characterKey: 'bloom.characters.sakura',
                dialogKey: 'bloom.scenes.s4',
                splashArt: {
                    background: 'linear-gradient(180deg, #1a0010 0%, #500030 25%, #be185d 50%, #ec4899 70%, #fce7f3 90%, #fff1f2 100%)',
                    overlayType: 'petals',
                    ambientColor: '#fecdd3',
                    vignette: 0.3,
                },
            },
            {
                id: 'bloom-5',
                characterKey: 'bloom.characters.narrator',
                dialogKey: 'bloom.scenes.s5',
                splashArt: {
                    background: 'linear-gradient(180deg, #000000 0%, #1a0010 15%, #831843 35%, #ec4899 55%, #fce7f3 75%, #0a000a 100%)',
                    overlayType: 'petals',
                    ambientColor: '#f472b6',
                    vignette: 0.6,
                },
            },
        ],
    },
];
