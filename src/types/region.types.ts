export interface Region {
  id: number;
  region: string;
  region_number: string;
  region_roman: string;
}

export interface Comuna {
  id: number;
  comuna: string;
  region: Region;
} 