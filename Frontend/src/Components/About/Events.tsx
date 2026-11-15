export interface EventsDataStruct {
    
    Name: string;
    Img: string;
    ImgAlt:string;

}

export function Events() : EventsDataStruct[] {
    
    return [

        {

            Name: "ICPEP 2026 C++ Programming Competition Champion",
            Img: "/Events/ICPEP.jpg",
            ImgAlt: "ICPEP 2026",

        },
        {

            Name: "ISITE 2026 C++ Programming Competition Champion",
            Img: "/Events/ISITE.jpg",
            ImgAlt: "ISITE 2026",

        },



    ]
}