interface Data {
  key: string;
  children?: Data[];
}

interface Value {
  id: string;
  padre_id: string | null;
  nombre: string;
  nivel: number;
  tipo: string;
  empresa_id: number;
  usuario_id: number;
}

export default function TreeMaker(values: Value[], parentId: string | null = null): Data[] {
  const filteredValues = values.filter(value => value.padre_id === parentId);
  return filteredValues.map(value => {
    const children = TreeMaker(values, value.id); //Acá, esto puede devolver un [] (array vacío)
    return {
      key: value.id,
      data: value,
      ...(children.length > 0 && { children })
    };
  });
}
export function TreeMakerGeneric<T extends { [key: string]: any; }>(values: T[], parentId: string | null = null, parentKey: string = 'padre_id'): Data[] {
  const filteredValues = values.filter(value => value[parentKey] === parentId);
  return filteredValues.map(value => {
    const children = TreeMakerGeneric(values, value.id, parentKey); //Acá, esto puede devolver un [] (array vacío)
    return {
      key: value.id,
      data: value,
      ...(children.length > 0 && { children })
    };
  });
}