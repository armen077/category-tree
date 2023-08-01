import {ListItem} from "../components/AccordionList";

export const findItem: (items: Array<ListItem>, id: string) => ListItem | undefined = (items, id) => {
    for (let item of items) {
        if (item.id === id) return item;

        if (item.children) {
            let found = findItem(item.children, id);
            if (found) return found;
        }
    }
};
