import { Component, Inject, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { debounce } from '@agentepsilon/decko';

export interface DropInfo {
  targetId: string|null;
  action?: string;
}

@Component({
  selector: 'app-modules-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DirectoryComponent {
  @Output() selectCategory: EventEmitter<string> = new EventEmitter();
  @Output() sortCategory: EventEmitter<Array<any>> = new EventEmitter();
  @Output() editCategory: EventEmitter<string> = new EventEmitter();
  @Output() addCategory: EventEmitter<string|undefined> = new EventEmitter();
  @Input() canEdit?: boolean;

  @Input()
  get nodes(): Array<any>|undefined { return this._nodes; }
  set nodes(nodes: Array<any>|undefined) {
    this._nodes = nodes;
    this.prepareDragDrop(nodes);
  }
  // tslint:disable-next-line: variable-name
  private _nodes?: Array<any>;

  // ids for connected drop lists
  dropTargetIds: Array<any> = [];
  nodeLookup: {[key: string]: any} = {};
  dropActionTodo?: DropInfo;

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  prepareDragDrop(nodes?: Array<any>): void {
    nodes?.forEach(node => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }

  @debounce(50)
  dragMoved(event: any): void {
    if (!this.canEdit){
      return;
    }

    const e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('node-item') ? e : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id')
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo.action = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo.action = 'after';
    } else {
      // inside
      this.dropActionTodo.action = 'inside';
    }
    this.showDragInfo();
  }


  drop(event: any): void {
    if (!this.dropActionTodo) { return; }

    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');
    if (!targetListId) {
      return;
    }

    // tslint:disable-next-line: no-console
    console.log(
      '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
      '\n[' + this.dropActionTodo.action + ']\n[' + this.dropActionTodo.targetId + '] from list [' + targetListId + ']');

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer = parentItemId !== 'main' ? this.nodeLookup[parentItemId].children : this.nodes;
    const newContainer = targetListId !== 'main' ? this.nodeLookup[targetListId].children : this.nodes;

    const i = oldItemContainer.findIndex((c: {[key: string]: any}) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex((c: {[key: string]: any}) => c.id === this.dropActionTodo?.targetId);
        if (this.dropActionTodo.action === 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        if (this.dropActionTodo.targetId) {
          this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem);
          this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        }
        break;
    }

    this.clearDragInfo(true);
    this.handleSortCategory();
  }
  getParentNodeId(id: string|null, nodesToSearch: any, parentId: string): string|undefined {
    for (const node of nodesToSearch) {
      if (node.id === id) { return parentId; }
      const ret = this.getParentNodeId(id, node.children, node.id);
      if (ret) { return ret; }
    }

    return;
  }

  showDragInfo(): void {
    this.clearDragInfo();
    if (this.dropActionTodo?.targetId) {
      this.document.getElementById('node-' + this.dropActionTodo.targetId)?.classList.add('drop-' + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false): void {
    if (dropped) {
      delete this.dropActionTodo;
    }
    this.document
    .querySelectorAll('.drop-before')
    .forEach(element => element.classList.remove('drop-before'));
    this.document
    .querySelectorAll('.drop-after')
    .forEach(element => element.classList.remove('drop-after'));
    this.document
    .querySelectorAll('.drop-inside')
    .forEach(element => element.classList.remove('drop-inside'));
  }

  handleSelectCategory(categoryId: string): void {
    this.selectCategory.emit(categoryId);
  }
  handleSortCategory(): void {
    this.sortCategory.emit(this.nodes);
  }
  handleEditCategory(categoryId: string): void {
    this.editCategory.emit(categoryId);
  }
  handleAddCategory(categoryId?: string): void {
    this.addCategory.emit(categoryId);
  }
}
