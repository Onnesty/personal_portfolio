export interface ProjectDataStruct {

    id: number;

    title: string;

    projectImage: string;

    technologies: TechnologyStruct[];

    description: string;

    link: string;

}

interface TechnologyStruct {

    Name: string;
    Image: string;
}

export function SoftwareProjectData(): ProjectDataStruct[] {

    return (
        [
            {
                id: 1,

                title: "Persona AI",

                projectImage: "/SoftwareProjects/PersonaAI.png",

                technologies: [
                    { Name: "HTML", Image: "/Technologies/HTML.svg" },
                    { Name: "CSS", Image: "/Technologies/CSS.svg" },
                    { Name: "TypeScript", Image: "/Technologies/TypeScript.svg" },
                    { Name: "React", Image: "/Technologies/React.svg" },
                    { Name: "MongoDB", Image: "/Technologies/MongoDB.svg" },

                ],

                description:
                    `
                    This is a web application where you can use your chat logs with someone else and replicate them using AI.
                    You can replicate as many as you want as long as you have the relevant data to provide.
                `,

                link: "https://personaai-tau-teal.vercel.app/"

            },

            {
                id: 2,

                title: "Encryptor & Decryptor",

                projectImage: "/SoftwareProjects/EncryptorDecryptor.png",

                technologies: [
                    { Name: "C++", Image: "/Technologies/CPP.svg" }
                ],

                description:
                    `
                    This is a Command Line Interface (CLI) application developed to encrypt a file into a binary file
                    and decrypt it back to its original file type, without the use of keys.
                `,

                link: "https://github.com/Onnesty/encryptor-decryptor-v2"

            }
        ]
    );

}

export function EngineeringProjectData(): ProjectDataStruct[] {

    return (

        [
            {
                id: 1,

                title: "Smart Wall Adapter",

                projectImage: "/EngineeringProjects/SmartPlug.JPG",

                technologies: [
                    { Name: "ArduinoIDE", Image: "/Technologies/ArduinoIDE.svg" },
                    { Name: "C++", Image: "/Technologies/CPP.svg" },
                    { Name: "EasyEDA", Image: "/Technologies/EasyEDA.svg" },
                    { Name: "Fusion360", Image: "/Technologies/Fusion.svg" },

                ],

                description:
                    `
                    IoT based project that features a wall adapter device that can be toggled on and off remotely
                    by a controller. Primarily uses ESP-NOW as the communication method.
                `,

                link: ""
            },

            {
                id: 2,

                title: "Mini Access Point",

                projectImage: "/EngineeringProjects/TrollWebsite.JPG",

                technologies: [
                    { Name: "ArduinoIDE", Image: "/Technologies/ArduinoIDE.svg" },
                    { Name: "C++", Image: "/Technologies/CPP.svg" },
                    { Name: "HTML", Image: "/Technologies/HTML.svg" },
                    { Name: "CSS", Image: "/Technologies/CSS.svg" },
                    { Name: "JavaScript", Image: "/Technologies/Javascript.svg" },
                    { Name: "EasyEDA", Image: "/Technologies/EasyEDA.svg" },
                ],

                description:
                    `
                    This project creates its own WiFi and acts as a WiFi access point. When a user connects, they are
                    immediately redirected to a website via DNS captive portal. In my case, I made it into a fake WiFi network
                    that leads to a prank website.
                    This also features an Admin Dashboard to check relevant information.
                `,

                link: "https://github.com/Onnesty/esp01s-8266-troll-website"
            }

        ]
    );

}
