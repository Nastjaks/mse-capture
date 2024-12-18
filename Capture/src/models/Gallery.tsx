export interface Gallery {
    id: React.Key | null | undefined;
    title: string;
    description: string;
    ownerId?: string;
}