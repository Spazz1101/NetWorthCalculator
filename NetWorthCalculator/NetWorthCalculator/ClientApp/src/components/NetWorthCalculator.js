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

    async function getNetWorthData () {
        const response = await fetch('./networth/GetData');
        const data = await response.json();

        setSections(data);
    }

    async function saveNetWorthSection(sectionIndex) {
        await fetch('./networth/SaveSection?sectionIndex=' + sectionIndex, { method: 'POST', body: JSON.stringify(sections[sectionIndex]), headers: { 'Content-Type': 'application/json' } }).then((res) => {
            console.log("Hi")
            console.log(res)
        });
    }

    function updateCategoryValue (value, sectionName, groupIndex, categoryIndex) {
        let newSections = [...sections];

        let section = newSections.filter((section) => section.Name === sectionName);

        section[0].Groups[groupIndex].Categories[categoryIndex].Value = value;

        setSections(newSections);

        calculateTotals();
    }

    function calculateTotals() {
        var newSections = [...sections];

        for (var i = 0; i < newSections.length; i++) {
            // section in sections
            let sectionTotal = 0;

            for (var j = 0; j < newSections[i].Groups.length; j++) {
                // var group in section.groups
                let groupTotal = 0;

                for (var k = 0; k < newSections[i].Groups[j].Categories.length; k++) {
                    if (typeof newSections[i].Groups[j].Categories[k].Value === "number") {
                        groupTotal += newSections[i].Groups[j].Categories[k].Value;
                    }
                }

                newSections[i].Groups[j].TotalValue = groupTotal;

                sectionTotal += groupTotal;
            }

            newSections[i].TotalValue = sectionTotal;
        }

        setSections(newSections);
    }

    function addGroup(sectionIndex, groupName) {
        let newSections = [...sections];

        let newGroup = {
            "Name": groupName,
            "Categories": [],
            "TotalValue": 0
        };

        newSections[sectionIndex].Groups.push(newGroup);

        setSections(newSections);
    }

    function addCategory(sectionIndex, groupIndex, categoryName) {
        let newSections = [...sections];

        let newCategory = {
            "Name": categoryName,
            "Value": 0
        };

        newSections[sectionIndex].Groups[groupIndex].Categories.push(newCategory);

        setSections(newSections);
    }

    async function resetSectionForm(sectionName, sectionIndex) {
        // Fetch the section from the json file
        const response = await fetch('./networth/GetSection?sectionName=' + sectionName);
        const data = await response.json();

        // Copy the sections state
        let resetSections = [...sections];

        // Reset the section with the data fetched from the json file
        resetSections[sectionIndex] = data;

        // Update the state with the reset section
        setSections(resetSections);

        // Reset the sections inputs
        document.getElementById(sectionName + "Form").reset();
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
                        <Table sectionData={section} sectionIndex={sectionIndex} updateCategoryValue={updateCategoryValue} saveNetWorthSection={saveNetWorthSection} resetSectionForm={resetSectionForm} addGroup={addGroup} addCategory={addCategory} />
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
