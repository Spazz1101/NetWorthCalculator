using Microsoft.AspNetCore.Mvc;
using NetWorthCalculator.Model;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NetWorthCalculator.Controllers
{
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

        private List<Section> GetJsonData()
        {
            // Create a new Section List object and deserialize the json file into it
            List<Section> sections = new();

            try
            {
                // Get the path to the json data file
                string path = Path.Combine(_webHostEnvironment.ContentRootPath, "Data", "NetWorthData.json");

                // Read in the entire json file
                string jsonData = System.IO.File.ReadAllText(path);

                

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

        [HttpGet("GetData")]
        public IActionResult GetData()
        {
            List<Section> sections = GetJsonData();

            if (sections != null)
                return Ok(sections);

            return NotFound();
        }

        [HttpGet("GetSection")]
        public IActionResult GetSection(string sectionName)
        {
            List<Section> sections = GetJsonData();

            if (sections != null)
            {
                Section section = sections.Find(x => x.Name == sectionName);

                if (section != null)
                    return Ok(section);
            }

            return NotFound();
        }

        [HttpPost("SaveData")]
        public IActionResult SaveData(List<Section> netWorthData)
        {
            try
            {
                // Get the path to the json data file
                string path = Path.Combine(_webHostEnvironment.ContentRootPath, "Data", "NetWorthData.json");

                string NetWorthDataText = JsonSerializer.Serialize(netWorthData);
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