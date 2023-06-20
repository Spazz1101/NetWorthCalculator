import React from 'react';
import './Table.css';

export default function Table(props) {
    const [edit, setEdit] = React.useState(false);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const updateCategoryValue = props.updateCategoryValue;
    const saveNetWorthData = props.saveNetWorthData;
    const resetSectionForm = props.resetSectionForm;
    const addGroup = props.addGroup;

    function validateInput(e, sectionName, groupIndex, categoryIndex) {
        updateCategoryValue(e, sectionName, groupIndex, categoryIndex);
    }

    function toggleSectionEdit() {
        setEdit(!edit);
    }

    function cancelChanges() {
        // Reset any changes to the section structure
        resetSectionForm(props.sectionData.Name, props.sectionIndex);

        // Toggle section out of edit
        toggleSectionEdit();
    }

    function submitChanges() {
        // Save the section changes
        saveNetWorthData();

        // Toggle section out of edit
        toggleSectionEdit();
    }

    function test() {
        //let groupName = document.getElementById(props.sectionIndex + "_group");

        //if (groupName !== undefined && groupName.value !== "") {
        //    addGroup(props.sectionIndex, groupName.value);
        //}
    }

    return (
        <div className="tableContainer">
            <form id={props.sectionData.Name + "Form"}>
                {
                    props.sectionData !== undefined &&
                    <table>
                        <thead>
                            <tr>
                                <th>{props.sectionData.Name}</th>
                                <th className="inputColumn">Current Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.sectionData.Groups.map((group, groupIndex) =>
                                    <React.Fragment key={groupIndex}>
                                        <tr className="groupRow">
                                            <td colSpan="2">{group.Name}</td>
                                        </tr>
                                        {
                                            Object.keys(group.Categories).length > 0 && group.Categories.map((category, categoryIndex) => {
                                                let inputID = props.sectionData.Name + "_" + groupIndex + "_" + categoryIndex;
                                                return (
                                                    <tr className="categoryRow" key={categoryIndex}>
                                                        <td className="categoryName">{category.Name}</td>
                                                        <td className="categoryInput">
                                                            {
                                                                edit ?
                                                                    <span>{formatter.format(category.Value)}</span>
                                                                :
                                                                    <React.Fragment>
                                                                        <span>$</span>
                                                                        <input id={inputID} type="number" min="0" step="0.01" defaultValue={category.Value} onInput={(e) => validateInput(e, props.sectionData.Name, groupIndex, categoryIndex)} />
                                                                    </React.Fragment>
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                        {
                                            edit &&
                                            <tr className="newCategory">
                                                <td colSpan="2">
                                                    <div>
                                                        <input id={props.sectionIndex + "_category"} type="text" />
                                                        <button className="addButton" onClick={(e) => test()}>Add Category</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                    </React.Fragment>
                                )
                            }
                            {
                                edit &&
                                <tr className="newGroup">
                                    <td colSpan="2">
                                        <div>
                                            <input id={props.sectionIndex + "_group"} type="text" />
                                            <button className="addButton" onClick={(e) => test()}>Add Group</button>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {
                                props.sectionData.Groups.map((group, index) =>
                                    <tr className="categoryTotalRow" key={index}>
                                        <td className="categoryTotalLabel">Total {group.Name}</td>
                                        <td className="categoryTotal">
                                            <span>{formatter.format(group.TotalValue)}</span>
                                        </td>
                                    </tr>
                                )
                            }
                            <tr className="categoryFinalTotalRow">
                                <td className="categoryTotalLabel">Total {props.sectionData.Name}</td>
                                <td className="categoryTotal">
                                    <span>{formatter.format(props.sectionData.TotalValue)}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                }
            </form>
            <div className="buttonGroup">
                <div className="leftGroup">
                    {
                        edit ?
                            <React.Fragment>
                                <button className="saveButton" title="Submit Changes" onClick={(e) => submitChanges()}>Submit</button>
                                <button className="resetButton" title="Cancel Changes" onClick={(e) => cancelChanges()}>Cancel</button>
                            </React.Fragment>
                        :
                            <button className="addButton" title="Edit Section" onClick={(e) => toggleSectionEdit()}>Edit Section</button>
                    }
                </div>
                {
                    !edit &&
                    <div className="rightGroup">
                        <button className="saveButton" onClick={(e) => saveNetWorthData()}>Save</button>
                        <button className="resetButton" onClick={(e) => resetSectionForm(props.sectionData.Name, props.sectionIndex)}>Reset</button>
                    </div>
                }
            </div>
        </div>
    );
}
