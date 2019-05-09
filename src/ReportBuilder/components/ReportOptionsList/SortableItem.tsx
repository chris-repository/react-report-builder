import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { DragHandle } from './DragHandle';

// #region -------------- Component -------------------------------------------------------------------

export const SortableItem = SortableElement(SortableHandle(DragHandle));

// #endregion
