namespace backend.DTOs;

public interface ICollectionResponse<T>
{
    List<T> Items { get; set; }
}