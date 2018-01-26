"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ServiceHelper = (function () {
    function ServiceHelper(http) {
        this.http = http;
    }
    ServiceHelper = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ServiceHelper);
    return ServiceHelper;
}());
exports.ServiceHelper = ServiceHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2aWNlLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwQztBQUMxQyxzQ0FBd0Q7QUFLeEQ7SUFFSSx1QkFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07SUFFOUIsQ0FBQztJQUpRLGFBQWE7UUFEekIsaUJBQVUsRUFBRTt5Q0FHaUIsV0FBSTtPQUZyQixhQUFhLENBUXpCO0lBQUQsb0JBQUM7Q0FBQSxBQVJELElBUUM7QUFSWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiXHJcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBIZWFkZXJzIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcclxuXHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgU2VydmljZUhlbHBlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICBcclxufVxyXG5cclxuIl19