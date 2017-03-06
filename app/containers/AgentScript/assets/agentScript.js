const script = {
  elements: [
    {
      type: "text",
      icon: "fa-font",
      label: "Text",
      text: "justText Placeholder",
      id: "ebe65c75-feda-45c9-852f-62cb6d2faca9",
      name: "justtext",
      description: "justTextDescription"
    },{
      type: "freeform",
      icon: "fa-list",
      label: "Freeform Input",
      text: "Textinput placeholder",
      id: "5c091844-8d5c-4259-88e0-cef6502baf33",
      name: "textinput",
      description: "textinputdescription"
    },{
      type: "dropdown",
      icon: "fa-list-alt",
      label:"Dropdown",
      text: "Dropfield Placeholder Text",
      options: [
        {
          name: "optionname",
          value: "optionval"
        }
      ],
      inputs: [
        {
          type: "list",
          name: "options",
          object: {
            name: "text",
            value: "text"
          },
          label : "Options"
        }
      ],
      id: "6d855feb-4286-4d9d-8799-bc11efe39b03",
      name: "dropfieldinput",
      description: "dropfielddescription"
    },{
      type: "scale",
      icon: "fa-circle-o",
      label: "Scale",
      inputs: [
        {
          type: "number",
          min: "0",
          max: "1",
          name: "lowerBound",
          label: "Lower Bound"
        },{
          type: "string",
          name: "lowerBoundLabel",
          label: "Lower Bound Label"
        },{
          type: "number",
          min: "1",
          max: "10",
          name: "upperBound",
          label: "Upper Bound"
        },{
          type: "string",
          name: "upperBoundLabel",
          label: "Upper Bound Label"
        }
      ],
      text: "Scale Input Placeholder Text",
      id: "32dd691b-aaed-4e6d-a9db-8aa153c33072",
      name: "scaleinput",
      description: "scaleinputdesc",
      lowerBound: 1,
      lowerBoundLabel: "lower bound label",
      upperBound: 10,
      upperBoundLabel: "upperboundlabel"
    },{
      type: "image",
      icon: "fa-picture-o",
      label: "Image",
      text: "Image Placeholder Text",
      inputs: [
        {
          type: "string",
          name: "value",
          label: "Image source"
        }
      ],
      id: "1ddcde81-e987-40b3-a3f0-7285e691f468",
      name: "imagefield",
      description: "imagedescription",
      value: "https://s-media-cache-ak0.pinimg.com/originals/8c/d0/6a/8cd06a1e9863595ba76ee9932fc4a164.jpg"
    },{
      type: "checkbox",
      icon: "fa-check-square-o",
      label: "Checkbox",
      text: "Checkbox Placeholder Text",
      options: [
        {
          name: "checkoption",
          value: "checkvalue"
        }
      ],
      inputs: [
        {
          type: "list",
          name: "options",
          object: {
            name: "text",
            value: "text"
          },
          label: "Options"
        }
      ],
      id: "51a6a8d7-e22e-4084-b211-f9e119936c7e",
      name: "checkboxinput",
      description: "checkboxdescription"
    },{
      type: "link",
      icon: "fa-link",
      label: "Link",
      text: "link Placeholder Text",
      inputs: [
        {
          type: "string",
          name: "href",
          label: "Link address"
        }
      ],
      id: "69c5443f-a0eb-4f6f-9bbe-631584427a32",
      name: "linkinput",
      description: "linkinputdescription",
      href: "http://cnn.com"
    }
  ],
  id: "522ca8e2-3edc-497e-a03b-ed34b6608a0c",
  name: "script"
};

export default script;
