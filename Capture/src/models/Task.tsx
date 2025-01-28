export interface Task {
    id: string;
    task: string;
    gallery_id: string;
    gallery_images: {
        length: number;
    };
}
