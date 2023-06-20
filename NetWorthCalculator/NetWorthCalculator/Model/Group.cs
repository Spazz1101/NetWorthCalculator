namespace NetWorthCalculator.Model
{
    public class Group
    {
        public string Name { get; set; }
        public List<Category> Categories { get; set; }
        public double TotalValue { get; set; }
    }
}
