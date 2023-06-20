import React from 'react';
import './Table.css';

export default function Table(props) {
    const [edit, setEdit] = React.useState(false);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const updateCategoryValue = props.updateCategoryValue;
    const resetSectionForm = props.resetSectionForm;
    const addGroup = props.addGroup;
    const addCategory = props.addCategory;

    function validateInput(e, sectionName, groupIndex, categoryIndex) {
        // Get the current value from the input
        let value = e.target.value;

        // The default value for when the inputed value is not a number and is less than zero is 0
        let validatedValue = 0;

        // Check if the value is a float that is greater than or equal to 0
        if (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
            // Get the index of the decimal place
            let decimalIndex = value.indexOf(".");

            // If the number contains more than 2 decimal places, then cut the extras off
            if (decimalIndex !== -1 && decimalIndex + 3 < value.length) {
                value = value.substring(0, decimalIndex + 3);
            }

            // Parse the string value into a float
            validatedValue = parseFloat(value);
        }

        // Update the categories value
        updateCategoryValue(validatedValue, sectionName, groupIndex, categoryIndex);
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
        props.saveNetWorthSection(props.sectionIndex);

        // Toggle section out of edit
        toggleSectionEdit();
    }

    function validateGroup(e) {
        // Prevent default which is submitting the form
        e.preventDefault();
        let groupName = document.getElementById(props.sectionIndex + "_group");

        if (groupName !== undefined && groupName.value !== "") {
            addGroup(props.sectionIndex, groupName.value);

            groupName.value = "";
        }
    }

    function validateCategory(e, groupIndex) {
        // Prevent default which is submitting the form
        e.preventDefault();

        let categoryName = document.getElementById(props.sectionIndex + "_" + groupIndex +"_category");

        if (categoryName !== undefined && categoryName.value !== "") {
            addCategory(props.sectionIndex, groupIndex, categoryName.value);

            categoryName.value = "";
        }
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
                                                                        <input id={inputID} type="number" min="0" value={category.Value} onChange={(e) => validateInput(e, props.sectionData.Name, groupIndex, categoryIndex)} />
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
                                                        <input id={props.sectionIndex + "_" + groupIndex + "_category"} type="text" />
                                                        <button className="addButton" onClick={(e) => validateCategory(e, groupIndex)}>Add Category</button>
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
                                            <button className="addButton" onClick={(e) => validateGroup(e)}>Add Group</button>
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
                        <button className="saveButton" onClick={(e) => props.saveNetWorthSection(props.sectionIndex)}>Save</button>
                        <button className="resetButton" onClick={(e) => resetSectionForm(props.sectionData.Name, props.sectionIndex)}>Reset</button>
                    </div>
                }
            </div>
        </div>
    );
}
