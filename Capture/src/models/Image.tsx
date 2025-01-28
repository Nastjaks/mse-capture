import {Task} from "./Task";

export interface Image {
    id: number;
    gallery_id: number;
    image_url: string;
    created_at: string;
    owner_id: string;
    task_id: string;
    tasks?: Task;
    profiles: {
        display_name: string;
    };
}