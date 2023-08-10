import { Container } from "./container";

export interface Storyboard{
    // id: string; //or number whatever firebase uses
    id?: string;

    storyName: string 

    containers: Container[];
}
    
    