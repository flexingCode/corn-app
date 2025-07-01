using AutoMapper;
using corn_api.DTO;
using corn_api.Entities;

namespace corn_api.Utils;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Purchase, PurchaseResponseDTO>();
        CreateMap<PurchaseDTO, Purchase>();
    }
}