import {ListItem} from "../components/AccordionList";
import {createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useState} from "react";

export type Tree = {
    id: string
    data: Array<ListItem>
}

interface AppContextState {
    tree: Tree | undefined
    setTree: Dispatch<SetStateAction<Tree | undefined>>
    isDirty: boolean
    setIsDirty: Dispatch<SetStateAction<boolean>>
}

const initialState = {
    tree: undefined,
    setTree: () => undefined,
    isDirty: false,
    setIsDirty: () => undefined
}

export const AppContext = createContext<AppContextState>(initialState)

const AppContextProvider: FC<PropsWithChildren> = ({children}) => {
    const [tree, setTree] = useState<Tree>()
    const [isDirty, setIsDirty] = useState<boolean>(false)

    return (
        <AppContext.Provider value={{
            tree,
            setTree,
            isDirty,
            setIsDirty
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
