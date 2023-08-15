import { Container } from "./container";

export interface Storyboard{
    // id: string; //or number whatever firebase uses
    id?: string;

    userName?: string;

    userId?: string;

    storyName: string;

    storyTopic?: string;

    containers: Container[];
}
    
    