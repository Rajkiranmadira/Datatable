import * as React from 'react';
// import styles from './Datatable.module.scss';
import { IDatatableProps } from './IDatatableProps';

import { SPComponentLoader } from '@microsoft/sp-loader';  
import * as $ from 'jquery';
import { sp } from '@pnp/sp/presets/all';  
import 'jszip/dist/jszip';  
import 'pdfmake/build/pdfmake';  
import 'datatables.net';  
import 'datatables.net-responsive';  
import 'datatables.net-buttons';  
import * as FileSaver from 'file-saver';  
import 'datatables.net-buttons/js/buttons.html5';  
import 'datatables.net-buttons/js/buttons.print'; 

SPComponentLoader.loadCss('https://cdn.datatables.net/responsive/2.2.3/css/responsive.bootstrap.min.css');    
SPComponentLoader.loadCss('https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css');  
SPComponentLoader.loadCss('https://cdn.datatables.net/buttons/1.6.0/css/buttons.dataTables.min.css');  
SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js')  
var sSearchtext='Search :';  
var sInfotext = 'Showing _START_ to _END_ of _TOTAL_ entries';  
var   sZeroRecordsText='No data available in table';  
var sinfoFilteredText="(filtered from _MAX_ total records)";  
// var   placeholderkeyword="Keyword";  
var lengthMenutxt="Show _MENU_ entries";  
var firstpage="First";  
var Lastpage="Last";  
var Nextpage="Next";  
var Previouspage="Previous"; 

export interface IReactPnpResponsiveDataTableState {    
  Projectstatus?:any[];  
}


export default class Datatable extends React.Component<IDatatableProps, IReactPnpResponsiveDataTableState> {

  constructor(props: IDatatableProps, state: IReactPnpResponsiveDataTableState) {  
    super(props);  
    this.state = {  
      Projectstatus: [{ Title: "", myscore: "" }]  
  
    };  
    this.fetchdatas = this.fetchdatas.bind(this);   
  } 


  componentDidMount(){  
    this.fetchdatas();  
  } 

  

  private fetchdatas() {  
    //const web = new Web(this.props.context.pageContext.web.absoluteUrl);  
    const list2 = sp.web.lists.getByTitle("ProjectStatus");  
    let FetchProjectDetails:any = [];  
    list2.items.select('Title,myscore').top(5000).get().then(r => {  
      for (let i = 0; i < r.length; i++) {  
        FetchProjectDetails.push({  
          Title: r[i].Title,  
          myscore: r[i].myscore,  
          
        });  
      }  
      this.setState({ Projectstatus: FetchProjectDetails });  
    });  
  } 

  public render(): React.ReactElement<IDatatableProps> {
    

    return (
      <div>

<table className='table-responsive table table-striped table-bordered dt-responsive nowrap display' id='SpfxDatatable'>  
          <thead>  
            <tr>  
              <th>Title</th>  
              <th>MyScore</th>  
               
            </tr>  
          </thead>  
          <tbody id='SpfxDatatableBody'>  
            {this.state.Projectstatus && this.state.Projectstatus.map((item, i) => {  
              return [  
                  <tr key={i}>  
                    <td>{item.Title}</td>  
                    <td>{item.myscore}</td>  
                    {/* <td>{item.id}</td>  
                    <td>{item.Forcastedate}</td>  
                    <td>{item.Actualdate}</td>  
                    <td>{item.TgtResDate}</td>   */}
                  </tr> 
              ];  
            })}  
          </tbody>  
        </table>  

      </div>
    );
  }


  componentDidUpdate() {  
    $.extend( $.fn.dataTable.defaults, {  
      responsive: true  
    } );  
    $("#SpfxDatatable").DataTable( {  
      "info": true,  
  
            "pagingType": 'full_numbers',  
            dom: 'lBfrtip',  
              
            buttons: [  
                
              {extend: 'copy'},  
              {extend: 'csv'},                   
           /*   { 
                extend: 'excel', 
                text: 'Export excel', 
                className: 'exportExcel', 
                filename: 'Export excel', 
                exportOptions: { 
                  modifier: { 
                    page: 'all' 
                  } 
                } 
              }, */  
              {  
                text: 'Json',  
                action: function ( e, dt, node, config ) {  
                  var data = dt.buttons.exportData();  
                  var blob = new Blob([ JSON.stringify( data ) ] , {type: "text/plain;charset=utf-8"});  
                  FileSaver.saveAs(blob, "Madhan.json");                
                }  
            },    
              {extend: 'pdf'},  
              {extend: 'print'}  
          ],             
  "order": [],  
  "language": {  
    "infoEmpty":sInfotext,  
      "info":sInfotext,  
      "zeroRecords":sZeroRecordsText,  
      "infoFiltered":sinfoFilteredText,  
   "lengthMenu": lengthMenutxt,  
  "search":sSearchtext,  
  "paginate": {  
    "first": firstpage,  
    "last": Lastpage,  
          "next": Nextpage,  
          "previous": Previouspage  
}      
  }      
  });  
  } 



  





}
