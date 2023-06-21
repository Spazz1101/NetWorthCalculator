import React from 'react';
import Table from './Table/Table';
import './NetWorthCalculator.css';

export default function Home () {
    const [sections, setSections] = React.useState([]);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    React.useEffect(() => {
        // Fetch the stored json data
        getNetWorthData();
    }, []);

    /**
     * This function fetches the net worth data from the networth/GetData endpoint and then sets the sections state with that data.
     */
    async function getNetWorthData () {
        const response = await fetch('./networth/GetData');
        const data = await response.json();

        setSections(data);
    }

    /**
     * This function sends the current sections values to be saved to the json file.
     * @param {number} sectionIndex The section's index position
     */
    async function saveNetWorthSection(sectionIndex) {
        await fetch('./networth/SaveSection?sectionIndex=' + sectionIndex, { method: 'POST', body: JSON.stringify(sections[sectionIndex]), headers: { 'Content-Type': 'application/json' } }).then((res) => {
            // If the save was unsuccessful, then log a message stating there being an issue.
            if (res.status !== 200) {
                console.log("There was an issue saving the section");
            }
        });
    }

    /**
     * This function updates a category's value.
     * @param {number} value The category's new value
     * @param {number} sectionIndex The section's index position
     * @param {number} groupIndex The group's index position
     * @param {number} categoryIndex The category's index position
     */
    function updateCategoryValue (value, sectionIndex, groupIndex, categoryIndex) {
        // Copy the current sections state array
        let newSections = [...sections];

        // Update the category with the new value
        newSections[sectionIndex].Groups[groupIndex].Categories[categoryIndex].Value = value;

        // Update the sections state with the new array
        setSections(newSections);

        // Recalculate the total values
        calculateTotals();
    }

    /**
     * This function recalculates the group and section totals and updates the sections state.
     */
    function calculateTotals() {
        // Copy the current sections state array
        let newSections = [...sections];

        // Loop through each of the sections
        for (var i = 0; i < newSections.length; i++) {
            // Variable to store the current section total
            let sectionTotal = 0;

            // Loop through each of the groups
            for (var j = 0; j < newSections[i].Groups.length; j++) {
                // Variable to store the current group total
                let groupTotal = 0;

                // Loop through each of the categories and append their value to the group total
                for (var k = 0; k < newSections[i].Groups[j].Categories.length; k++) {
                    // Double check that the category's value is numeric
                    if (typeof newSections[i].Groups[j].Categories[k].Value === "number") {
                        groupTotal += newSections[i].Groups[j].Categories[k].Value;
                    }
                }

                // Set the new group total and append the group total to the section total
                newSections[i].Groups[j].TotalValue = groupTotal;
                sectionTotal += groupTotal;
            }

            // Set the new section total
            newSections[i].TotalValue = sectionTotal;
        }

        // Update the sections state with the new array
        setSections(newSections);
    }

    /**
     * This function adds a new group to a section.
     * @param {number} sectionIndex The section's index position
     * @param {string} groupName The name of the new group
     */
    function addGroup(sectionIndex, groupName) {
        // Copy the current sections state array
        let newSections = [...sections];

        // Create a new group object to be added
        let newGroup = {
            "Name": groupName,
            "Categories": [],
            "TotalValue": 0
        };

        // Append the new group to the section
        newSections[sectionIndex].Groups.push(newGroup);

        // Update the sections state with the new array
        setSections(newSections);
    }

    /**
     * This function adds a new category to a group.
     * @param {number} sectionIndex The section's index position
     * @param {number} groupIndex The group's index position
     * @param {string} categoryName The name of the new category
     */
    function addCategory(sectionIndex, groupIndex, categoryName) {
        // Copy the current sections state array
        let newSections = [...sections];

        // Create a new category to be added
        let newCategory = {
            "Name": categoryName,
            "Value": 0
        };

        // Append the new category to the group
        newSections[sectionIndex].Groups[groupIndex].Categories.push(newCategory);

        // Update the sections state with the new array
        setSections(newSections);
    }

    /**
     * This function resets a sections values back to the last saved values for the section.
     * @param {*} sectionName The section's name
     * @param {*} sectionIndex The section's index position
     */
    async function resetSectionForm(sectionName, sectionIndex) {
        // Fetch the section to reset from the json file
        const response = await fetch('./networth/GetSection?sectionName=' + sectionName);
        const data = await response.json();

        // Copy the current sections state array
        let resetSections = [...sections];

        // Reset the section with the data fetched from the json file
        resetSections[sectionIndex] = data;

        // Update the state with the reset section
        setSections(resetSections);

        // Reset the sections inputs
        document.getElementById(sectionName + "Form").reset();
    }

    /**
     * This function deletes a section's group.
     * @param {number} sectionIndex The section's index position
     * @param {number} groupIndex The group's index position
     */
    function deleteGroup(sectionIndex, groupIndex) {
        // Copy the current sections state array
        let newSections = [...sections];

        // Splice off the group to be removed
        newSections[sectionIndex].Groups.splice(groupIndex, 1);

        // Update the sections state with the new array
        setSections(newSections);

        // Recalculate the total values
        calculateTotals();
    }

    /**
     * This function deletes a group's category.
     * @param {number} sectionIndex The section's index position
     * @param {number} groupIndex The group's index position
     * @param {number} categoryIndex The category's index position
     */
    function deleteCategory(sectionIndex, groupIndex, categoryIndex) {
        // Copy the current sections state array
        let newSections = [...sections];

        // Splice off the category to be removed
        newSections[sectionIndex].Groups[groupIndex].Categories.splice(categoryIndex, 1);

        // Update the sections state with the new array
        setSections(newSections);

        // Recalculate the total values
        calculateTotals();
    }

    return (
        <div>
            <div className="pageHeader">
                <h1>Net Worth Calculator</h1>
            </div>
            {
                sections.map((section, sectionIndex) =>
                    <div className="sectionContainer" key={sectionIndex}>
                        <div className="sectionHeader">
                            <h3>{section.Name}</h3>
                        </div>
                        <Table sectionData={section} sectionIndex={sectionIndex} updateCategoryValue={updateCategoryValue} saveNetWorthSection={saveNetWorthSection} resetSectionForm={resetSectionForm} addGroup={addGroup} addCategory={addCategory} deleteGroup={deleteGroup} deleteCategory={deleteCategory} />
                    </div>
                )
            }
            <div className="sectionContainer">
                <div className="sectionHeader">
                    <h3>Net Worth</h3>
                </div>
                <div className="netWorthContainer">
                    {
                        sections.length > 0 &&
                        <table>
                            <tbody>
                                <tr>
                                    <td className="label">Total Assets</td>
                                    <td>{formatter.format(sections[0].TotalValue)}</td>
                                </tr>
                                <tr>
                                    <td className="label">&#8722; Total Liabilities</td>
                                    <td>{formatter.format(sections[1].TotalValue)}</td>
                                </tr>
                                <tr>
                                    <td className="label"><b>Net Worth</b></td>
                                    <td>{formatter.format(sections[0].TotalValue - sections[1].TotalValue)}</td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    );
}
