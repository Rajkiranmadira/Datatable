import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { sp } from '@pnp/sp/presets/all'; 
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


import * as strings from 'DatatableWebPartStrings';
import Datatable from './components/Datatable';
import { IDatatableProps } from './components/IDatatableProps';

export interface IDatatableWebPartProps {
  description: string;
}

export default class DatatableWebPart extends BaseClientSideWebPart<IDatatableWebPartProps> {

  

  public render(): void {
    const element: React.ReactElement<IDatatableProps> = React.createElement(
      Datatable,
      {
        description: this.properties.description,
        context: this.context 
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {  
    return new Promise<void>((resolve: () => void, reject: (error?: any) => void): void => {  
      sp.setup({  
        sp: {  
          headers: {  
            "Accept": "application/json; odata=nometadata"  
          }  
        }  
      });  
      resolve();  
    });  
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
