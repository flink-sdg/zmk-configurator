import {type Ref, ref} from 'vue';
import {Subject} from "rxjs";

export class ModalService
{
    private static _modalService: ModalService | null = null;

    public isModalOverlayEscapable: Ref<boolean> = ref(true);
    public isModalOverlayClickable: Ref<boolean> = ref(true);
    public isModalOverlayVisible: Ref<boolean> = ref(false);
    public onInteractModalOverlay$: Subject<boolean> = new Subject<boolean>();

    private constructor() {}

    public static instance(): ModalService
    {
        if(!this._modalService)
            this._modalService = new ModalService();

        return this._modalService;
    }

    public showModalOverlay(): ModalService {
        this.isModalOverlayVisible.value = true;
        return this;
    }

    public hideModalOverlay(): ModalService {
        this.isModalOverlayVisible.value = false;
        return this;
    }

    public toggleModalOverlay(): ModalService {
        this.isModalOverlayVisible.value = !this.isModalOverlayVisible.value;
        return this;
    }

    public onInteractModalOverlay(){
        this.onInteractModalOverlay$.next(true);
    }
}