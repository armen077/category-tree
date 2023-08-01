import React, {useCallback, useContext, useEffect, useState} from 'react';
import {MainContainer} from "./components/MainContainer";
import AccordionList from "./components/AccordionList";
import {db} from "./services/firebase";
import {collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import {AppContext} from "./context/AppContext";
import Button from "./components/Button";

function App() {
    const {tree, setTree, isDirty, setIsDirty} = useContext(AppContext)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const saveChanges = useCallback(() => {
        if (!tree) return

        const docRef = doc(db, "trees", tree.id);

        setIsSaving(true)

        updateDoc(docRef, { data: tree.data })
            .then(() => {
                alert("Changes saved");
                setIsDirty(false)
            })
            .catch((error) => {
                console.error("Error updating tree: ", error);
            })
            .finally(() => {
                setIsSaving(false)
            })
    }, [tree])

    useEffect(() => {
        getDocs(collection(db, "trees"))
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const tree = doc.data()

                    if (tree.data) {
                        setTree({
                            id: doc.id,
                            data: tree.data
                        })
                    }
                })
            })
            .catch((error) => {
                console.error("Error getting trees: ", error)
            });
    }, [])

    return (
        <MainContainer>
            {tree && (
                <AccordionList items={tree.data} />
            )}

            {isDirty && (
                <Button onClick={saveChanges} disabled={isSaving}>Save</Button>
            )}
        </MainContainer>
    );
}

export default App;
