import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-middle-pane',
  templateUrl: './middle-pane.component.html',
  styleUrl: './middle-pane.component.scss'
})
export class MiddlePaneComponent {

  constructor(private cd: ChangeDetectorRef){

  }

  newTaskName !: string;
  newTaskDescription !: string;
  displaynewItemError = false;
  newItem = {name:'',description:'',elements:[],isEditable:false,required:false};
  draggedIndex: number | null = null;
  singleOptionList = ['Option1','Option2','Other'];
  multiOptionList = ['Options1','Options2','Options3','Options4'];
  dropdownOptionList = ['Options1','Options2','Options3','Options4']
  @Input() index !: number
  @Input() selectedItem !: any;
  @Input() defaultItem !: boolean;
  @Input() fieldGroups !: any[];
  @Input() indexemitter !: number;
  @Input() isEditable !: boolean;
  @Output() fieldGroupsList = new EventEmitter();
  @Output() newItemList = new EventEmitter();
  @Output() cloneItem = new EventEmitter();
  uploadedFiles: File[] = [];

  ngOnChanges(changes:SimpleChanges){
    if(changes['fieldGroups']){
      this.fieldGroups[this.index]?.elements.forEach((data:any)=>{
        if(data.type == 'input-single-select'){
          data.selectValues = JSON.parse(JSON.stringify(this.singleOptionList))
        } else if(data.type == 'input-multi-select'){
          data.selectValues = JSON.parse(JSON.stringify(this.multiOptionList))
        } else if(data.type == 'input-dropdown'){
          data.selectValues = JSON.parse(JSON.stringify(this.dropdownOptionList))
        }
      })
    }
      // console.log(changes['fieldGroups'].currentValue)
  }


  ngOnInit(){
   
  }

  editText(){
    this.isEditable = true;
  }

  onSave(){
    this.displaynewItemError = false;
    if(this.selectedItem.name.trim().length < 1){
      this.displaynewItemError = true;
    } else if(this.defaultItem ){
      this.isEditable = false;
      this.addNewItem(this.selectedItem.name,this.selectedItem.description);
      this.selectedItem = this.fieldGroups[this.fieldGroups.length - 1];
      this.index = this.fieldGroups.length - 1;
      this.newItemList.emit(this.fieldGroups)
    } else{
      this.isEditable = false;
      this.fieldGroups[this.index].name = this.selectedItem.name
      this.fieldGroups[this.index].description = this.selectedItem.description
    }
    
  }

  addNewItem(name:string,description:string){
    let newItem = JSON.parse(JSON.stringify(this.newItem));;
    newItem.name = name;
    newItem.description = description
    this.fieldGroups.push(newItem)
  }

  deleteItem(){
    this.fieldGroups.splice(this.index,1)
    this.selectedItem = this.fieldGroups[0];
  }

  editItem(item:any,i:number){
    // console.log(item);
    this.selectedItem.elements[i].isEditable = true;
  }

  copyItem(item:any,i:number){
    // console.log(item)
    this.selectedItem?.elements.push(JSON.parse(JSON.stringify(item)))
  }

  deleteItemTask(item:any,i:number){
    // console.log(item)
    this.selectedItem.elements.splice(i,1)
  }

  onBlurFunction(){
    this.fieldGroups[this.index].elements = this.selectedItem.elements
  }

  onSaveItem(item:any,i:number){
    let curVal = this.fieldGroups[this.index].elements;
    curVal[i].isEditable = false;
    curVal[i].label = item.label;
    this.commaSeparatedValues(curVal,i,item);
    // this.fieldGroups[this.index].elements = JSON.parse(JSON.stringify(curVal));
    this.fieldGroups[this.index].elements = curVal
    this.selectedItem = this.fieldGroups[this.index];
    this.cd.detectChanges()
  }

  commaSeparatedValues(currVal:any,i:number,item:any){
    if(item.itemList != undefined){
      let itemList = item.itemList.trim().split(',');
      itemList = itemList.map((data:any) => data.trim())
      // console.log(itemList);
      item.selectValues = JSON.parse(JSON.stringify(itemList));
      // currVal[i].selectValues = JSON.parse(JSON.stringify(itemList));
    }
  }

  cloneText(){
    this.cloneItem.emit(this.selectedItem)
  }

  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();

    if (this.draggedIndex !== null) {
      const draggedItem = this.selectedItem.elements[this.draggedIndex];
      const targetItem = this.selectedItem.elements[dropIndex];

      this.selectedItem.elements[this.draggedIndex] = targetItem;
      this.selectedItem.elements[dropIndex] = draggedItem;
      // console.log(this.draggedIndex, dropIndex)
      // this.selectedItem = [...this.selectedItem]
      this.draggedIndex = null;
      this.cd.detectChanges();
    }
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  onSelectCheckbox(item:any,opt:any){
    // console.log(item,opt);
    this.fieldGroupsList.emit(this.selectedItem)
  }

  onFileSelect(event:any,item:any){
    const file = event.target.files[0]; 
    if (file) {


      const clonedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      });

      // this.uploadedFiles.push(clonedFile);
      item.value = clonedFile; 
    }
    // console.log(item.value,file);
    this.fieldGroupsList.emit(this.selectedItem)
  }

  downloadFile(item: any) {
    if (item.value && item.value.name) {
      // Create a Blob URL for the uploaded file
      const url = URL.createObjectURL(item.value);
      
      // Create an anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = item.value.name;  // Set the file name for download
      document.body.appendChild(a);
      a.click();  // Trigger the download
      document.body.removeChild(a);  // Remove the anchor element from the DOM
      URL.revokeObjectURL(url);  // Clean up the Blob URL
    }
  }
}
