import type {Behavior} from '@/models';
import {type Ref, ref} from 'vue';

export class BindingService
{
    private static _bindingService: BindingService | null = null;
    
    public behaviors: Ref<Behavior[]> = ref([]);
    public keycodes: Ref<any> = ref([]);

    private constructor() {}

    public static instance(): BindingService
    {
        if(!this._bindingService)
            this._bindingService = new BindingService();

        return this._bindingService;
    }
}
