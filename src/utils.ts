export const filterBy = (search: string, field: string) => (item: any) => {
  return new RegExp(search, 'i').test(item[field]);
};
