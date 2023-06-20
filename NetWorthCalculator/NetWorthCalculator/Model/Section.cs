namespace NetWorthCalculator.Model
{
    public class Section
    {
        public string Name { get; set; }
        public List<Group> Groups { get; set; }
        public double TotalValue { get; set; }
    }
}