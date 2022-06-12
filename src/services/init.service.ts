import {BindingService} from '@/services/binding.service';
import {LayoutService} from '@/services/layout.service';
import {type Ref, ref} from 'vue';

export class InitService
{
    private static _initService: InitService | null = null;
    
    public isInit: Ref<boolean> = ref(false);
    
    private constructor(private layoutService: LayoutService, private bindingService: BindingService)
    {
    }
    
    public static instance(layoutService: LayoutService = LayoutService.instance(), bindingService: BindingService = BindingService.instance()): InitService
    {
        if(!this._initService)
        {
            this._initService = new InitService(layoutService, bindingService);
        }
        
        return this._initService;
    }
    
    public init(): InitService
    {
        Promise.all([
            fetch('/layouts/config.json').then((response: Response) => response.json()),
            fetch('/behaviors/config.json').then((response: Response) => response.json()),
            fetch('/keycodes/config.json').then((response: Response) => response.json())
        ]).then(([layoutList, behaviors, keycodes]) =>
               {
                   if(layoutList.layoutFiles?.length)
                   {
                       Promise.all(layoutList.layoutFiles.map(
                           (filename: string) => fetch(
                               '/layouts/' + filename)
                               .then((response: Response) => response.json())))
                           .then((data: any) =>
                                 {
                                     this.layoutService.layouts.value = data;
                                     this.layoutService.selectedLayout.value = (<any>this.layoutService.layouts.value)[0];
                                     this.isInit.value = true;
                                 })
                           .catch((err: Error) =>
                                  {
                                      console.error(
                                          'Error fetching layouts: ',
                                          err
                                      );
                                      this.isInit.value = true;
                                  });
                   }
                   else
                   {
                       console.error(
                           'Error fetching layouts: No layout files found.');
                       this.isInit.value = true;
                   }
                   
                   this.bindingService.behaviors.value = behaviors.behaviors;
                   this.bindingService.keycodes.value = keycodes;
               });
        
        return this;
    }
}
