namespace SharpKitLibrary
{
    public interface IRequest
    {
        string ClientId { get; set; }
        string _cstype { get; }
    }
}