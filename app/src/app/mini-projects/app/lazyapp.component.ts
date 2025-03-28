import { ChangeDetectorRef, Component, NgZone } from '@angular/core';

@Component({
  selector: 'lazy-app-root',
  templateUrl: './lazyapp.component.html',
  styleUrl: './lazyapp.component.scss'
})
export class LazyAppComponent {
  title = 'zuper-app';
  fieldGroups !: any[];
  selectedItem !: any;
  newItem = {name:'',description:'',elements:[],isEditable:false,required:false}
  isModalOpen !: boolean;
  taskName !: string;
  descriptionName !: string;
  displayError = false;
  index !: number;
  defaultItem = true;
  draggedIndex: number | null = null;
  droppedItem: string | null = null
  isEditable = false;
  uploadFile !: File[]

  constructor(private cd:ChangeDetectorRef, private zone: NgZone){}

  ngOnInit(){
    this.fieldGroups = [
      {name:'AMC Reports',description:'test1',elements:[
        {label:"Email",type:'input-text',value:'',isEditable:false,required:false},
        {label:"UserName",type:'input-text',value:'',isEditable:false,required:true},
      ]},
      {name:'HVAC Repair',description:'test2',elements:[
        {label:"Text area",type:'input-text-area',value:'',isEditable:false,required:false}
      ]},
      {name:'AMC Yearly',description:'test3',elements:[
        {label:"Phone Number",type:'input-number',value:'',isEditable:false,required:false}
      ]},
      {name:'AMC Installations',description:'test4',elements:[
        {label:"Phone Number",type:'input-number',value:'',isEditable:false,required:false}
      ]}  
    ];
    // localStorage.setItem('defaultList',JSON.stringify(this.fieldGroups));
    this.selectedItem = JSON.parse(JSON.stringify(this.newItem));
    this.index = -1
    this.isEditable = true;
  }

  onClickItem(item:any,i:number){
   this.defaultItem = false
   this.isEditable = false;
  //  console.log(item);
   this.selectedItem = JSON.parse(JSON.stringify(item)) 
   this.selectedItem = item 
   this.index = i;
   this.cd.detectChanges();
  }

 

  onDragStart(event: DragEvent, index: number): void { // dragging in left pane
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent): void {    // drag over in left pane
    event.preventDefault(); 
  }

  onDrop(event: DragEvent, dropIndex: number): void { // dropping in left pane
    event.preventDefault();

    if (this.draggedIndex !== null) {
      const draggedItem = this.fieldGroups[this.draggedIndex];
      const targetItem = this.fieldGroups[dropIndex];

      this.fieldGroups[this.draggedIndex] = targetItem;
      this.fieldGroups[dropIndex] = draggedItem;

      this.draggedIndex = null;
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.displayError = false;
    this.taskName = "";
    this.descriptionName = ""
  }

  closeModal() {
    this.isModalOpen = false;
  }

  Onsubmit(){
    this.displayError = false;
    if(this.taskName.trim().length >= 1){
      this.addNewItem(this.taskName,this.descriptionName);
      this.closeModal();
      this.selectedItem = this.fieldGroups[this.fieldGroups.length - 1];
      this.index = this.fieldGroups.length - 1
      this.isEditable = false
    } else{
      this.displayError = true;
    }
   
  }

  addNewItem(name:string,description:string){
    let newItem = JSON.parse(JSON.stringify(this.newItem));;
    newItem.name = name;
    newItem.description = description
    this.fieldGroups.push(newItem);
    this.fieldGroups = [...this.fieldGroups]
  }

  onDefaultClick(){
    this.selectedItem = JSON.parse(JSON.stringify(this.newItem));
    this.index = -1
    this.defaultItem = true;
    this.isEditable = true
  }

  onDragOverItem(event:any){
    event.preventDefault();
    // console.log(event, "dragOver")
  }
  onDropItem(event:DragEvent){
    event.preventDefault();
    if(this.defaultItem){
      alert("You cannot drag and drop without selecting any item on left pane")
    } else{
    const item = event.dataTransfer?.getData('text'); 
    // console.log(item);
    let newItem : any;
    if(item == 'input-text'){
      newItem = {label:" Enter header",type:'input-text',value:'',isEditable:false,required:false}
    } else if(item == 'input-text-area'){
      newItem = {label:" Enter header",type:'input-text-area',value:'',isEditable:false,required:false}
    } else if(item == 'input-number'){
      newItem = {label:" Enter header",type:'input-number',value:'',isEditable:false,required:false}
    } else if(item == 'input-date'){
      newItem = {label:" Enter header",type:'input-date',value:'',isEditable:false,required:false}
    } else if(item == 'input-time'){
      newItem = {label:" Enter header",type:'input-time',value:'',isEditable:false,required:false}
    } else if(item == 'input-date-time'){
      newItem = {label:" Enter header",type:'input-date-time',value:'',isEditable:false,required:false}
    } else if(item == 'input-single-select'){
      newItem = {label:" Enter header",type:'input-single-select',value:'',isEditable:false,selectValues:[],itemList:'',required:false}
    } else if(item == 'input-multi-select'){
      newItem = {label:" Enter header",type:'input-multi-select',value:{},isEditable:false,selectValues:[],itemList:'',required:false}
    } else if(item == 'input-dropdown'){
      newItem = {label:" Enter header",type:'input-dropdown',value:[],isEditable:false,selectValues:[],itemList:'',required:false}
    } else if(item == 'input-file'){
      newItem = {label:" Enter header",type:'input-file',value:{},isEditable:false,required:false}
    }

    if (item != undefined && item?.length > 1) {
    let currentValue = [...this.fieldGroups[this.index].elements]; 

    currentValue.push({ ...newItem }); 
    this.fieldGroups = [...this.fieldGroups];  
    this.fieldGroups[this.index].elements = [...currentValue]; 
    this.selectedItem = this.fieldGroups[this.index]
      
      this.cd.detectChanges()
    }
  }
  }






  //

  newItemList(event:any){
    console.log(event);
    this.selectedItem = this.fieldGroups[this.fieldGroups.length - 1];
    this.index = this.fieldGroups.length - 1;
    this.defaultItem = false;
  }

  fieldGroupsList(event:any){
    this.fieldGroups[this.index] = event;
  }

  cloneItem(event:any){
    this.fieldGroups.push(event);
  }
}
