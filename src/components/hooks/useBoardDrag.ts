import { useDrag } from "react-dnd";

export function useBoardDrag(type: string, item: object) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return { isDragging, drag };
}
