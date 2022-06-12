import {ref} from "vue";
import {Alignment, Position, PositionType, ScreenWidth} from "@/models";

export class UiService {
    private static _uiService: UiService | null = null;

    public screenWidth = ref(this.getScreenWidth());

    private constructor() {
        window.addEventListener('resize', () => {
            this.screenWidth.value = this.getScreenWidth();
        });
    }

    public static instance(): UiService {
        if (!this._uiService)
            this._uiService = new UiService();

        return this._uiService;
    }

    public positionFixedSubordinateObject(subordinateObject: HTMLElement | string, object: HTMLElement | string, position: Position): UiService {
        let subordinateObjectElement: HTMLElement | null =  typeof subordinateObject === 'string' ? document.getElementById(subordinateObject): subordinateObject;
        let objectElement: HTMLElement | null = typeof object === 'string' ? document.getElementById(object): object;

        if(!objectElement || !subordinateObjectElement)
            return this;

        return this;
    }
z
    public positionAbsoluteSubordinateObject(subordinateObject: HTMLElement | string, object: HTMLElement | string, position: Position): UiService {
        let subordinateObjectElement: HTMLElement | null =  typeof subordinateObject === 'string' ? document.getElementById(subordinateObject): subordinateObject;
        let objectElement: HTMLElement | null = typeof object === 'string' ? document.getElementById(object): object;

        if(!objectElement || !subordinateObjectElement)
            return this;

        return this;
    }

    /**
     * Aligns a subordinateObject (HTMLElement or id) with an object (HTMLElement or id).  The alignment enum specifies first
     * the side that's aligned, then where around the object the subordinateObject is placed.
     *
     * This method will attach a fixed position style to the subordinate element.
     *
     * This method is often used in conjunction with the adjustSubordinateObjectPositionAlignment method to better ensure aligned /
     * positioned elements don't move off-screen.
     *
     * @param subordinateObject
     * @param object
     * @param alignment
     * @param zIndex
     */

    public alignFixedSubordinateObject(subordinateObject: HTMLElement | string, object: HTMLElement | string, alignment: Alignment = Alignment.RIGHT_BELOW, zIndex: number = 1): UiService {
        let subordinateObjectElement: HTMLElement | null =  typeof subordinateObject === 'string' ? document.getElementById(subordinateObject): subordinateObject;
        let objectElement: HTMLElement | null = typeof object === 'string' ? document.getElementById(object): object;

        if(!objectElement || !subordinateObjectElement)
            return this;

        subordinateObjectElement.style.position = 'fixed';
        subordinateObjectElement.style.zIndex = zIndex.toString();

        const subordinateObjectElementRect: DOMRect = subordinateObjectElement.getBoundingClientRect();
        const objectElementRect: DOMRect = objectElement.getBoundingClientRect();

        if(alignment === Alignment.RIGHT_BELOW) {
            subordinateObjectElement.style.left = (objectElementRect.x + objectElementRect.width - subordinateObjectElementRect.width) + 'px';
            subordinateObjectElement.style.top = (objectElementRect.y + objectElementRect.height + 1) + 'px';
        } else if(alignment === Alignment.RIGHT_ABOVE) {
            subordinateObjectElement.style.left = (objectElementRect.x + objectElementRect.width - subordinateObjectElementRect.width) + 'px';
            subordinateObjectElement.style.top = (objectElementRect.y - subordinateObjectElementRect.height - 1) + 'px';
        } else if(alignment === Alignment.LEFT_BELOW) {
            subordinateObjectElement.style.left = objectElementRect.x + 'px';
            subordinateObjectElement.style.top = (objectElementRect.y + objectElementRect.height + 1) + 'px';
        } else if(alignment === Alignment.LEFT_ABOVE) {
            subordinateObjectElement.style.left = objectElementRect.x + 'px';
            subordinateObjectElement.style.top = (objectElementRect.y - subordinateObjectElementRect.height - 1) + 'px';
        } else if(alignment === Alignment.TOP_ARIGHT) {
            subordinateObjectElement.style.left = (objectElementRect.x + objectElementRect.width + 1) + 'px';
            subordinateObjectElement.style.top = objectElementRect.y + 'px';
        } else if(alignment === Alignment.TOP_ALEFT) {
            subordinateObjectElement.style.left = (objectElementRect.x - subordinateObjectElementRect.width - 1) + 'px';
            subordinateObjectElement.style.top = objectElementRect.y + 'px';
        } else if(alignment === Alignment.BOTTOM_ARIGHT) {
            subordinateObjectElement.style.left = (objectElementRect.x + objectElementRect.width + 1) + 'px';
            subordinateObjectElement.style.top = (objectElementRect.y + objectElementRect.height - subordinateObjectElementRect.height) + 'px';
        } else if(alignment === Alignment.BOTTOM_ALEFT) {
            subordinateObjectElement.style.left = (objectElementRect.x - subordinateObjectElementRect.width - 1) + 'px';
            subordinateObjectElement.style.top = (objectElementRect.y + objectElementRect.height - subordinateObjectElementRect.height) + 'px';
        }

        return this;
    }

    /**
     * Aligns a subordinateObject (HTMLElement or id) with an object (HTMLElement or id).  The alignment enum specifies first
     * the side that's aligned, then where around the object the subordinateObject is placed.
     *
     * This method will attach an absolute position style to the subordinate element, and if the object doesn't have a position
     * style, an appropriate position style (relative) will be attached.  The subordinate element will then be appended to the object.
     *
     * Object styling can affect the subordinate object.
     *
     * This method is often used in conjunction with the adjustSubordinateObjectPositionAlignment method to better ensure aligned /
     * positioned elements don't move off-screen.
     *
     * @param subordinateObject
     * @param object
     * @param alignment
     * @param zIndex
     */

    public alignAbsoluteSubordinateObject(subordinateObject: HTMLElement | string, object: HTMLElement | string, alignment: Alignment = Alignment.RIGHT_BELOW, zIndex: number = 1): UiService {
        let subordinateObjectElement: HTMLElement | null =  typeof subordinateObject === 'string' ? document.getElementById(subordinateObject): subordinateObject;
        let objectElement: HTMLElement | null = typeof object === 'string' ? document.getElementById(object): object;

        if(!objectElement || !subordinateObjectElement)
            return this;

        if(subordinateObjectElement.parentElement !== objectElement)
            subordinateObjectElement.remove();

        subordinateObjectElement.style.position = 'absolute';
        subordinateObjectElement.style.zIndex = zIndex.toString();

        if(!['relative', 'absolute', 'fixed'].includes(window.getComputedStyle(objectElement).position))
            objectElement.style.position = 'relative';

        if(subordinateObjectElement.parentElement !== objectElement)
            objectElement.appendChild(subordinateObjectElement);

        const subordinateObjectElementRect: DOMRect = subordinateObjectElement.getBoundingClientRect();
        const objectElementRect: DOMRect = objectElement.getBoundingClientRect();

        if(alignment === Alignment.RIGHT_BELOW) {
            subordinateObjectElement.style.left = (objectElementRect.width - subordinateObjectElementRect.width) + 'px';
            subordinateObjectElement.style.top = (objectElementRect.height + 1) + 'px';
        } else if(alignment === Alignment.RIGHT_ABOVE) {
            subordinateObjectElement.style.left = (objectElementRect.width - subordinateObjectElementRect.width) + 'px';
            subordinateObjectElement.style.top = (-(subordinateObjectElementRect.height + 1)) + 'px';
        } else if(alignment === Alignment.LEFT_BELOW) {
            subordinateObjectElement.style.left = '0px';
            subordinateObjectElement.style.top = (objectElementRect.height + 1) + 'px';
        } else if(alignment === Alignment.LEFT_ABOVE) {
            subordinateObjectElement.style.left = '0px';
            subordinateObjectElement.style.top = (-(subordinateObjectElementRect.height + 1)) + 'px';
        } else if(alignment === Alignment.TOP_ARIGHT) {
            subordinateObjectElement.style.left = (objectElementRect.width + 1) + 'px';
            subordinateObjectElement.style.top = '0px';
        } else if(alignment === Alignment.TOP_ALEFT) {
            subordinateObjectElement.style.left = (-(subordinateObjectElementRect.width + 1)) + 'px';
            subordinateObjectElement.style.top = '0px';
        } else if(alignment === Alignment.BOTTOM_ARIGHT) {
            subordinateObjectElement.style.left = (objectElementRect.width + 1) + 'px';
            subordinateObjectElement.style.top = (objectElementRect.height - subordinateObjectElementRect.height) + 'px';
        } else if(alignment === Alignment.BOTTOM_ALEFT) {
            subordinateObjectElement.style.left = (-(subordinateObjectElementRect.width + 1)) + 'px';
            subordinateObjectElement.style.top = (objectElementRect.height - subordinateObjectElementRect.height) + 'px';
        }

        return this;
    }

    /**
     * This method attempts to move elements that have been positioned off-screen.  There are still scenarios where an element
     * may appear off-screen after it's position has been adjusted.
     *
     * There are diminishing returns on position adjustment; it's up to developers to ensure their UIs afford good UX.
     *
     * @param subordinateObject
     * @param object
     * @param positionType
     */

    public adjustSubordinateObjectPositionAlignment(subordinateObject: HTMLElement | string, object: HTMLElement | string, positionType: PositionType): UiService {
        let subordinateObjectElement: HTMLElement | null =  typeof subordinateObject === 'string' ? document.getElementById(subordinateObject): subordinateObject;
        let objectElement: HTMLElement | null = typeof object === 'string' ? document.getElementById(object): object;

        if(!objectElement || !subordinateObjectElement)
            return this;

        const subordinateObjectElementRect: DOMRect = subordinateObjectElement.getBoundingClientRect();
        const objectElementRect: DOMRect = objectElement.getBoundingClientRect();
        const innerHeight: number = window.innerHeight;
        const innerWidth: number = window.innerWidth;

        const xCollision: boolean = (subordinateObjectElementRect.y >= objectElementRect.y && subordinateObjectElementRect.y <= objectElementRect.y + objectElementRect.height) ||
            (subordinateObjectElementRect.y + subordinateObjectElementRect.height >= objectElementRect.y  && subordinateObjectElementRect.y + subordinateObjectElementRect.height <= objectElementRect.y + objectElementRect.height) ||
            (subordinateObjectElementRect.y < objectElementRect.y && subordinateObjectElementRect.y + subordinateObjectElementRect.height > objectElementRect.y + objectElementRect.height);

        const yCollision: boolean = (subordinateObjectElementRect.x >= objectElementRect.x && subordinateObjectElementRect.x <= objectElementRect.x + objectElementRect.width) ||
            (subordinateObjectElementRect.x + subordinateObjectElementRect.width >= objectElementRect.x  && subordinateObjectElementRect.x + subordinateObjectElementRect.width <= objectElementRect.x + objectElementRect.width) ||
            (subordinateObjectElementRect.x < objectElementRect.x && subordinateObjectElementRect.x + subordinateObjectElementRect.width > objectElementRect.x + objectElementRect.width);

        if(subordinateObjectElementRect.x < 0) {
            if(xCollision) {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.left = (objectElementRect.x + objectElementRect.width) + 'px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.left = objectElementRect.width + 'px';
            }
            else {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.left = '0px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.left = (0 - objectElementRect.x) + 'px';
            }
        }

        if(subordinateObjectElementRect.y < 0) {
            if(yCollision) {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.top = (objectElementRect.y + objectElementRect.height) + 'px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.top = objectElementRect.height + 'px';
            }
            else {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.top = '0px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.top = (0 - objectElementRect.y) + 'px';
            }
        }

        if(subordinateObjectElementRect.x + subordinateObjectElementRect.width > innerWidth) {
            if(xCollision) {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.left = (objectElementRect.x - subordinateObjectElementRect.width) + 'px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.left = -(subordinateObjectElementRect.width) + 'px';
            }
            else {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.left = (innerWidth - subordinateObjectElementRect.width) + 'px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.left = (innerWidth - (objectElementRect.x + objectElementRect.width)) + 'px';
            }
        }

        if(subordinateObjectElementRect.y + subordinateObjectElementRect.height > innerHeight) {
            if(yCollision) {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.top = objectElementRect.y - subordinateObjectElementRect.height + 'px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.top = -(subordinateObjectElementRect.height) + 'px';
            }
            else {
                if(positionType === PositionType.FIXED)
                    subordinateObjectElement.style.top = innerHeight - subordinateObjectElementRect.height + 'px';
                else if(positionType === PositionType.ABSOLUTE)
                    subordinateObjectElement.style.top = (innerHeight - (objectElementRect.y + objectElementRect.height)) + 'px';
            }
        }

        return this;
    }

    private getScreenWidth(): ScreenWidth {
        const screenWidth: number = window.innerWidth;

        if (screenWidth < 640)
            return ScreenWidth.XS;
        else if (screenWidth < 768)
            return ScreenWidth.SM;
        else if (screenWidth < 1024)
            return ScreenWidth.MD;
        else if (screenWidth < 1280)
            return ScreenWidth.LG;
        else if (screenWidth < 1536)
            return ScreenWidth.XL;

        return ScreenWidth.XXL;
    }
}