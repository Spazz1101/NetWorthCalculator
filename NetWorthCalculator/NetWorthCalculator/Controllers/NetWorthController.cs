using Microsoft.AspNetCore.Mvc;
using NetWorthCalculator.Model;
using System.Text.Json;

namespace NetWorthCalculator.Controllers
{
    /// <summary>
    /// Controller for net worth endpoints
    /// </summary>
    [ApiController]
    [Route("networth")]
    public class NetWorthController : ControllerBase
    {
        private readonly ILogger<NetWorthController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public NetWorthController(ILogger<NetWorthController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// Returns the net worth json data
        /// </summary>
        /// <returns>List of section</returns>
        private List<Section> GetJsonData()
        {
            // Create a new List of Sections
            List<Section> sections = new();

            try
            {
                // Get the path to the json data file
                string path = Path.Combine(_webHostEnvironment.ContentRootPath, "Data", "NetWorthData.json");

                // Read in the entire json file
                string jsonData = System.IO.File.ReadAllText(path);

                // Make sure the json string is not null and then deserialize the data into the section list
                if (jsonData != null)
                {
                    sections = JsonSerializer.Deserialize<List<Section>>(jsonData);
                }

                // Return the json data
                return sections;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error fetching json data", ex);

                return sections;
            }
        }

        /// <summary>
        /// Returns the net worth json as a section list
        /// </summary>
        /// <returns>Action Result containing the json object</returns>
        [HttpGet("GetData")]
        public IActionResult GetData()
        {
            // Get the json data and save it into the section list
            List<Section> sections = GetJsonData();

            // If the list is null, then return not found
            if (sections == null)
                return NotFound();

            // Return the json
            return Ok(sections);
        }

        /// <summary>
        /// Returns a net worth section
        /// </summary>
        /// <param name="sectionName">the section name to be returned</param>
        /// <returns>Action Result containing the json object</returns>
        [HttpGet("GetSection")]
        public IActionResult GetSection(string sectionName)
        {
            // Get the json data and save it into the section list
            List<Section> sections = GetJsonData();

            // Make sure the section list is not null
            if (sections == null)
                return NotFound();

            // Look for the section to be returned by name
            Section section = sections.Find(x => x.Name == sectionName);

            // Make sure the section is not null
            if (section == null)
                return NotFound();

            // Return the section
            return Ok(section);
        }

        /// <summary>
        /// Updates a section inside the saved json file
        /// </summary>
        /// <param name="netWorthSection">the updated section to save</param>
        /// <param name="sectionIndex">the index of the section to save</param>
        /// <returns></returns>
        [HttpPost("SaveSection")]
        public IActionResult SaveSection([FromBody] Section netWorthSection, int sectionIndex)
        {
            // Get the json data and save it into the section list
            List<Section> sections = GetJsonData();

            // Make sure the section list is not null
            if (sections == null)
                return NotFound();

            // Update the section
            sections[sectionIndex] = netWorthSection;

            try
            {
                // Get the path to the json data file
                string path = Path.Combine(_webHostEnvironment.ContentRootPath, "Data", "NetWorthData.json");

                // Serialize the json object
                string NetWorthDataText = JsonSerializer.Serialize(sections);

                // Write the string out to the json file
                System.IO.File.WriteAllText(path, NetWorthDataText);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error saving json data", ex);

                return NotFound();
            }
        }
    }
}