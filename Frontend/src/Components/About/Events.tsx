export interface EventsDataStruct {
    
    Name: string;
    Img: string;
    ImgAlt:string;
    Link: string;

}

export function Events() : EventsDataStruct[] {
    
    return [

        {

            Name: "ICPEP 2026 C++ Programming Competition Champion",
            Img: "/Events/ICPEP.jpg",
            ImgAlt: "ICPEP 2026",
            Link: "https://www.facebook.com/share/p/1FRUAUkEZ3/",


        },
        {

            Name: "ISITE 2026 C++ Programming Competition Champion",
            Img: "/Events/ISITE.jpg",
            ImgAlt: "ISITE 2026",
            Link: "https://www.facebook.com/share/p/196K8YsFuF/",

        },



    ]
}