import { LightningElement } from 'lwc';

export default class TrailheadMap extends LightningElement {
    mapOptions={
        'disableDefaultUI': true,
        'draggable': true,
    };
    mapMarkers=[
        {
            location:{
                City: 'San Francisco',
                Country: 'USA',
                PostalCode: '94105',
                State: 'CA',
                Street: '425 Mission St',
            },
            mapIcon:{
                path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                fillColor: '#CF3476',
                fillOpacity: .5,
                strokeWeight: 1,
                scale: .10,
            }
        }
    ];
}