import { Component } from "./Component";

/* Marker interface */
interface DropdownItem extends Component {};

enum DropdownState {
    hidden,
    shown
}

export class Dropdown implements Component {
    private _content: HTMLElement = document.createElement("ul");
    public get content() {
        return this._content;
    }
    public constructor() {
        this._content.classList.add("dropdown");
    }
    public add(...menus: DropdownMenu[]) {
        for (let i = 0; i < menus.length; i++) {
            this._content.appendChild(menus[i].content);
        }
    }
}

export class DropdownMenu implements Component {
    private name: string;
    private items: DropdownItem[] = [];
    private state: DropdownState = DropdownState.hidden;
    private menu: HTMLElement;
    private _content: HTMLElement = document.createElement("li");
    public constructor(name: string) {
        // set attributes
        this.name = name;
        // create base element
        const button = document.createElement("button");
        button.classList.add("dropdown-item");
        button.textContent = this.name;
        window.addEventListener("click", (event) => this.updateState(event));
        this._content.appendChild(button);
    }
    public get content() {
        return this._content;
    }
    public add(...items: DropdownItem[]) {
        for (let i = 0; i < items.length; i++) {
            this.items.push(items[i]);
        }
    }
    public updateState(event: Event) {
        switch(this.state) {
            case DropdownState.hidden:
                if (event.target == this._content.firstChild) {
                    this.menu = document.createElement("ul");
                    this.menu.classList.add("dropdown-menu");
                    for (let i = 0; i < this.items.length; i++) {
                        this.menu.appendChild(this.items[i].content);
                    }
                    this._content.appendChild(this.menu);
                    this.state = DropdownState.shown;
                }
                break;
            case DropdownState.shown:
                this._content.removeChild(this.menu);
                this.state = DropdownState.hidden;
                break;
        }
    }
}

export class DropdownSubMenu implements DropdownItem, Component  {
    private _content: HTMLElement = document.createElement("li");
    private name: string;
    private items: DropdownItem[] = [];
    private state: DropdownState = DropdownState.hidden;
    private menu: HTMLElement;
    public constructor(name: string) {
        // set attributes
        this.name = name;
        // create base element
        window.addEventListener("click", event => this.updateState(event));
        this._content.addEventListener("mouseover", event => this.updateState(event));
        this._content.addEventListener("mouseleave", event => this.updateState(event));
        const button = document.createElement("button");
        button.textContent = name;
        button.classList.add("dropdown-item");
        this._content.appendChild(button);
    }
    public get content(): HTMLElement {
        return this._content;
    }
    public add(...items: DropdownItem[]): void {
        for (let i = 0; i < items.length; i++) {
            this.items.push(items[i]);
        }
    }
    public updateState(event: Event): void {
        switch(this.state) {
            case DropdownState.hidden:
                if (event.type == "mouseover") {
                    this.menu = document.createElement("ul");
                    this.menu.classList.add("dropdown-menu", "dropdown-submenu");
                    for (let i = 0; i < this.items.length; i++) {
                        this.menu.appendChild(this.items[i].content);
                    }
                    this._content.appendChild(this.menu);
                    this.state = DropdownState.shown;
                }
                break;
            case DropdownState.shown:
                if (event.type == "mouseleave" || event.type == "click") {
                        this._content.removeChild(this.menu);
                        this.state = DropdownState.hidden;
                }
                break;
        }
    }
}

export class DropdownSeperator implements DropdownItem, Component {
    private _content: HTMLElement = document.createElement("hr");
    public get content(): HTMLElement {
        return this._content;
    }
}

export class DropdownButton implements DropdownItem, Component {
    private _content: HTMLElement = document.createElement("li");

    public get content(): HTMLElement {
        return this._content;
    }
    
    public constructor(name: string, action: EventListenerOrEventListenerObject) {
        const button = document.createElement("button");
        button.classList.add("dropdown-item");
        if (action == null)
            button.classList.add("dropdown-disabled");
        else {
            button.addEventListener("click", action);
        }
        button.textContent = name;
        this._content.appendChild(button);
    }
}