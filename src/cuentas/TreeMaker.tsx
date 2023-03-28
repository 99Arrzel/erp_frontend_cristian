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
    const children = TreeMaker(values, value.id);
    return {
      key: value.id,
      data: value,
      ...(children.length > 0 && { children })
    };
  });
}