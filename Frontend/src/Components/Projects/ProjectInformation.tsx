



export interface ProjectDataStruct {
    
    ID : number;

    Title : string;

    ProjectImage : string;

    Technologies : TechnologyStruct[];

    Description : string;

    Link : string;

}

interface TechnologyStruct {

    Name : string;
    Image : string;
}



export function SoftwareProjectData() : ProjectDataStruct[] {

    return (
        [
            {
                ID : 1,
                
                Title : "Encryptor & Decryptor",

                ProjectImage: "/SoftwareProjects/EncryptorDecryptor.png",

                Technologies : [
                    { Name: "C++", Image: "/Technologies/CPP.svg"}
                ],

                Description : 
                `
                    This is a Command Line Interface (CLI) application developed to encrypt a file into a binary file
                    and decrypt it back to its original file type, without the use of keys.
                `,

                Link: "https://github.com/Onnesty/encryptor-decryptor-v2"


            }
        ]
    )

}

export function EngineeringProjectData() : ProjectDataStruct[] {

    return (

        [

            {
                ID : 1,
                
                Title : "Mini Fake Access Point",

                ProjectImage: "/EngineeringProjects/TrollWebsite.jpeg",

                Technologies : [
                    { Name: "ArduinoIDE", Image: "/Technologies/ArduinoIDE.svg"}, 
                    { Name: "C++", Image: "/Technologies/CPP.svg"},
                    { Name: "HTML", Image: "/Technologies/HTML.svg"}, 
                    { Name: "CSS", Image: "/Technologies/CSS.svg"}, 
                    { Name: "JavaScript", Image: "/Technologies/Javascript.svg"}, 
                    { Name: "EasyEDA", Image: "/Technologies/EasyEDA.svg"}, 
                ],

                Description : 
                `
                    This project creates its own WiFi and acts as a fake WiFi access point. When a user connects, they are 
                    immediately redirected to a fake website via DNS captive portal.
                    This utilizes an ESP-01s mounted on a custom perforated board circuit. This also features an Admin Dashboard
                    to check information, such as devices connected and devices who fell for it, and it also features operations, such as
                    changing the SSID and clearing out the devices list.



                `,

                Link: "https://github.com/Onnesty/esp01s-8266-troll-website"
            }
            
        ]
    )

}