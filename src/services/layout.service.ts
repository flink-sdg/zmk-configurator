import type {Binding, Layout} from '@/models';
import {ref} from 'vue';
import type {Ref} from 'vue';

export class LayoutService
{
    private static _layoutService: LayoutService | null = null;
    
    public layouts: Ref<Layout[]> = ref([]);
    
    public selectedLayout: Ref<Layout> = ref(this.layouts.value[0]);
    
    private constructor()
    {
    }
    
    public static instance(): LayoutService
    {
        if(!this._layoutService)
        {
            this._layoutService = new LayoutService();
        }
        
        return this._layoutService;
    }
    
    public insertRow(index: number): LayoutService
    {
        
        return this;
    }
    
    public insertColumn(index: number): LayoutService
    {
        
        return this;
    }
}
