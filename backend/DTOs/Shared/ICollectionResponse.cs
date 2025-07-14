namespace backend.DTOs.Shared;

public interface ICollectionResponse<T>
{
    List<T> Items { get; set; }
}