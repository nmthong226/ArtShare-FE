export interface ProjectFormValues {
  projectName: string;
  description: string;
  platform: {
    id: number;
    name: string;
  };
}
