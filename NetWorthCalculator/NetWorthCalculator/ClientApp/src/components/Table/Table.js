import React from 'react';
import './Table.css';

export default function Table(props) {
    const [edit, setEdit] = React.useState(false);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    /**
     * This function validates the number input's value.
     * The validation that is checked for is if the value is a number, is the number greater than or equal to 0, and are there only 2 decimal places.
     * @param {Event} e The input onChange event
     * @param {*} groupIndex The group's index position
     * @param {*} categoryIndex The category's index position
     */
    function validateInput(e, groupIndex, categoryIndex) {
        // Get the current value from the input
        let value = e.target.value;

        // The default value to set a category when validation fails is 0
        let validatedValue = 0;

        // Check if the value is a number that is greater than or equal to 0
        if (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
            // Get the index of the decimal place
            let decimalIndex = value.indexOf(".");

            // If the number contains more than 2 decimal places, then truncate the number
            if (decimalIndex !== -1 && decimalIndex + 3 < value.length) {
                value = value.substring(0, decimalIndex + 3);
            }

            // Parse the float value
            validatedValue = parseFloat(value);
        }

        // Update the category's value
        props.updateCategoryValue(validatedValue, props.sectionIndex, groupIndex, categoryIndex);
    }

    /**
     * This function toggles the section between display and edit modes.
     */
    function toggleSectionEdit() {
        setEdit(!edit);
    }

    /**
     * This function cancels the section edit changes.
     */
    function cancelChanges() {
        // Reset any changes to the section structure
        props.resetSectionForm(props.sectionData.Name, props.sectionIndex);

        // Toggle section out of edit mode
        toggleSectionEdit();
    }

    /**
     * This function submits the section's edited changes.
     */
    function submitChanges() {
        // Save the section changes
        props.saveNetWorthSection(props.sectionIndex);

        // Toggle section out of edit mode
        toggleSectionEdit();
    }

    /**
     * This function validates a new group name and if valid it then adds it to a section.
     * @param {Event} e The button's onClick event
     */
    function validateGroup(e) {
        // Prevent default which is submitting the form
        e.preventDefault();

        // Get the new group input element
        let groupName = document.getElementById(props.sectionIndex + "_group");

        // Validate that the element exists, the value is not empty, and the group name doesn't already exist in the section.
        if (groupName == null || groupName.value === "") {
            window.alert("Group name cannot be empty");
        } else if (props.sectionData.Groups.filter((group) => group.Name === groupName.value).length > 0) {
            window.alert("A group with this name already exists in this section");
        } else {
            // Add the group to the section
            props.addGroup(props.sectionIndex, groupName.value);

            // Reset the input value
            groupName.value = "";
        }
    }

    /**
     * This function validates a new category and then adds it to a group.
     * @param {Event} e The button's onClick event
     * @param {*} groupIndex The group's index position
     */
    function validateCategory(e, groupIndex) {
        // Prevent default which is submitting the form
        e.preventDefault();

        // Get the new category input element
        let categoryName = document.getElementById(props.sectionIndex + "_" + groupIndex +"_category");

        // Validate that the element exists, the value is not empty, and the category name doesn't already exist in the group.
        if (categoryName == null || categoryName.value === "") {
            window.alert("Category name cannot be empty");
        } else if (props.sectionData.Groups[groupIndex].Categories.filter((category) => category.Name === categoryName.value).length > 0) {
            window.alert("A category with this name already exists in this group");
        } else {
            // Add the category to the group
            props.addCategory(props.sectionIndex, groupIndex, categoryName.value);

            // Reset the input value
            categoryName.value = "";
        }
    }

    /**
     * This function cofirms the users intent to delete a group before deleting it.
     * @param {Event} e The button's onClick event
     * @param {number} sectionIndex The section's index position
     * @param {number} groupIndex The group's index position
     */
    function confirmGroupDelete(e, sectionIndex, groupIndex) {
        // Prevent default which is submitting the form
        e.preventDefault();

        // Confirm that the user wants to delete the group before deleting it
        if(window.confirm("Are you sure you want to delete this group?")) {
            props.deleteGroup(sectionIndex, groupIndex);
        }
    }

    /**
     * This function cofirms the users intent to delete a category before deleting it.
     * @param {Event} e The button's onClick event
     * @param {number} sectionIndex The section's index position
     * @param {number} groupIndex The group's index position
     * @param {number} categoryIndex The category's index position
     */
    function confirmCategoryDelete(e, sectionIndex, groupIndex, categoryIndex) {
        // Prevent default which is submitting the form
        e.preventDefault();

        // Confirm that the user wants to delete the category before deleting it
        if(window.confirm("Are you sure you want to delete this category?")) {
            props.deleteCategory(sectionIndex, groupIndex, categoryIndex);
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
                                            <td colSpan="2">
                                                <span>{group.Name}</span>
                                                {
                                                    edit &&
                                                    <button className="deleteButton" title="Delete Group" onClick={(e) => confirmGroupDelete(e, props.sectionIndex, groupIndex)}>X</button>
                                                }
                                            </td>
                                        </tr>
                                        {
                                            Object.keys(group.Categories).length > 0 && group.Categories.map((category, categoryIndex) =>
                                                <tr className="categoryRow" key={categoryIndex}>
                                                    <td className="categoryName">{category.Name}</td>
                                                    <td className="categoryInputContainer">
                                                        {
                                                            edit ?
                                                                <React.Fragment>
                                                                    <span className="displayInputValue">{formatter.format(category.Value)}</span>
                                                                    <button className="deleteButton" title="Delete Category" onClick={(e) => confirmCategoryDelete(e, props.sectionIndex, groupIndex, categoryIndex)}>X</button>
                                                                </React.Fragment>
                                                            :
                                                                <React.Fragment>
                                                                    <span>$</span>
                                                                    <input type="number" autoComplete="off" min="0" value={category.Value} onChange={(e) => validateInput(e, groupIndex, categoryIndex)} />
                                                                </React.Fragment>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        {
                                            edit &&
                                            <tr className="newCategory">
                                                <td colSpan="2">
                                                    <div>
                                                        <input id={props.sectionIndex + "_" + groupIndex + "_category"} type="text" autoComplete="off" />
                                                        <button className="addButton" title="Add Category" onClick={(e) => validateCategory(e, groupIndex)}>Add Category</button>
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
                                            <input id={props.sectionIndex + "_group"} type="text" autoComplete="off" />
                                            <button className="addButton" title="Add Group" onClick={(e) => validateGroup(e)}>Add Group</button>
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
                                <button className="saveButton" title="Submit Section Changes" onClick={(e) => submitChanges()}>Submit</button>
                                <button className="resetButton" title="Cancel Section Changes" onClick={(e) => cancelChanges()}>Cancel</button>
                            </React.Fragment>
                        :
                            <button className="addButton" title="Edit Section" onClick={(e) => toggleSectionEdit()}>Edit Section</button>
                    }
                </div>
                {
                    !edit &&
                    <div className="rightGroup">
                        <button className="saveButton" title="Save Section" onClick={(e) => props.saveNetWorthSection(props.sectionIndex)}>Save</button>
                        <button className="resetButton" title="Reset Section to Last Save" onClick={(e) => props.resetSectionForm(props.sectionData.Name, props.sectionIndex)}>Reset</button>
                    </div>
                }
            </div>
        </div>
    );
}
