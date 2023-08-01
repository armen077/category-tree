import {FC, useContext, useState, ChangeEvent} from "react";
import styled from "styled-components";
import {AnimatePresence, motion} from "framer-motion";
import {EditIcon} from "../icons/EditIcon"
import {AppContext} from "../context/AppContext";
import {produce} from "immer";
import {findItem} from "../utils/common";
import Input from "./Input";
import Button from "./Button";
import {v4 as uuid} from "uuid"
import {CloseIcon} from "../icons/CloseIcon";

export type ListItem = {
    id: string
    title: string
    parentId?: string
    children?: Array<ListItem>
}

interface IProps {
    items: Array<ListItem>
    root?: boolean
}

const Container = styled.div<{ $isRoot?: boolean }>`
  background-color: #dedede;
  padding: 4px 8px;
`

const ActionButton = styled.button`
  background: transparent;
  border: none;
  height: 30px;
  width: 36px;
  cursor: pointer;
  
  &:hover {
    background-color: #aebebe;
  }
`

Container.defaultProps = {
    $isRoot: true
}

const Item = styled.div``

const ItemTitle = styled.div`
  position: relative;
  z-index: 1;
  padding: 2px 4px;
  cursor: pointer;
  background-color: #dedede;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #becece;
  }
  
  .caret {
    color: #07f;
    margin-right: 8px;
  }
`

const AccordionList: FC<IProps> = (props) => {
    const {setTree, setIsDirty} = useContext(AppContext)
    const [visibleId, setVisibleId] = useState<string>()
    const [editableId, setEditableId] = useState<string>()
    const {items, root} = props

    const toggleVisible: (item: ListItem) => void = (item) => {
        if (editableId === item.id) return
        setVisibleId((val) => val === item.id ? undefined : item.id)
    }

    const editTitle: (item: ListItem) => void = (item) => {
        setEditableId((val) => val === item.id ? undefined : item.id)
    }

    const handleInputChange: (id: string, event: ChangeEvent<HTMLInputElement>) => void = (id, event) => {
        setTree(
            produce(draft => {
                if (!draft) return

                const item = findItem(draft.data, id);
                if (item) {
                    item.title = event.target?.value;
                }
            })
        );

        setIsDirty(true)
    }

    const addItem: (id?: string) => void = (id) => {
        setTree(
            produce(draft => {
                if (!draft) return

                if (!id) {
                    draft.data.push({
                        id: uuid(),
                        title: 'New'
                    })
                    return
                }

                const item = findItem(draft.data, id);

                if (!item) return

                const children = item?.children || [];
                children.push({
                    id: uuid(),
                    title: 'New',
                    parentId: item.id
                })

                item.children = children
            })
        );

        setIsDirty(true)
    }

    const removeItem: (item: ListItem) => void = (item) => {

        setTree(
            produce(draft => {
                if (!draft) return

                let items = draft.data

                if (item.parentId) {
                    items = findItem(draft.data, item.parentId)?.children || []
                }

                items.splice(items.findIndex(o => o.id === item.id), 1)
            })
        );

        setIsDirty(true)
    }

    return (
        <Container $isRoot={root}>
            {
                items.map((item) => (
                    <Item key={item.id}>
                        <ItemTitle onClick={() => toggleVisible(item)}>
                            <motion.div className="caret" animate={{rotate: visibleId === item.id ? -180 : 0}}>&#9660;</motion.div>
                            {
                                editableId === item.id ? <Input value={item.title} onChange={(e) => handleInputChange(item.id, e)} /> :
                                <span>{item.title}</span>
                            }
                            <ActionButton onClick={(e) => {
                                e.stopPropagation()
                                editTitle(item)
                            }}>
                                <EditIcon />
                            </ActionButton>
                            <ActionButton onClick={(e) => {
                                e.stopPropagation()
                                removeItem(item)
                            }}>
                                <CloseIcon />
                            </ActionButton>
                        </ItemTitle>

                        <AnimatePresence>
                            {visibleId === item.id && (
                                <motion.div
                                    initial={{opacity: 0, translateY: -16}}
                                    animate={{opacity: 1, translateY: 0}}
                                    exit={{opacity: 0, translateY: -16}}>
                                    {!!item.children?.length && (
                                        <AccordionList root={false} items={item.children} />
                                    )}

                                    <div>
                                        <Button $ml onClick={() => addItem(item.id)}>Add item</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Item>
                ))
            }

            {root && <Button onClick={() => addItem()}>Add item</Button>}
        </Container>
    )
}

AccordionList.defaultProps = {
    root: true
}

export default AccordionList
