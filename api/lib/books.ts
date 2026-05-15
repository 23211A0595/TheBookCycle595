export const bookSelect = `
  select
    b.id,
    b.title,
    b.author,
    b.price,
    b.condition,
    b.image,
    b.category,
    b.description,
    b.location,
    b.status,
    b.created_at as "createdAt",
    coalesce(u.full_name, 'TheBookCycle Seller') as "sellerName",
    coalesce(u.rating, 5.0)::float as "sellerRating",
    u.id as "sellerId"
  from books b
  left join users u on u.id = b.seller_id
`;

