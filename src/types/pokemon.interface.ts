export interface Pokemon {
    id: number;
    name: string;
    image: string; // sprites.others["official-artwork"].front_default
    types: string[];
    height: number;
    weight: number;
}
