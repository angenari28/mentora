namespace Mentora.Domain.Common;

public class PagedResult<T>
{
    public required IReadOnlyList<T> Items { get; init; }

    public PaginationMeta Meta { get; init; } = null!;
}

public record PaginationMeta
{
    public int TotalCount { get; init; }
    public int PageNumber { get; init; }
    public int PageSize { get; init; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious => PageNumber > 1;
    public bool HasNext => PageNumber < TotalPages;
}
