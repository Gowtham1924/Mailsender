import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import "react-day-picker/style.css"

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  const currentYear = new Date().getFullYear();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white rounded-xl border border-gray-200 shadow-md relative w-[280px]", className)}
      captionLayout="dropdown"
      startMonth={new Date(currentYear - 10, 0)}
      endMonth={new Date(currentYear + 10, 11)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4 relative w-full",
        month_caption: "flex justify-center items-center h-9 relative mb-2",
        caption_label: "hidden", // Hide standard month label since we use dropdowns
        caption_dropdowns: "flex items-center gap-1.5 justify-center font-semibold text-sm text-gray-800 z-10",
        dropdown: "relative inline-flex items-center gap-1 cursor-pointer bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg px-2 py-1 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-6",
        dropdown_container: "relative inline-flex items-center after:content-[''] after:pointer-events-none after:absolute after:right-2.5 after:top-1/2 after:-translate-y-1/2 after:border-t-4 after:border-t-gray-500 after:border-x-4 after:border-x-transparent",
        nav: "flex items-center justify-between absolute top-1 left-0 right-0 z-20 pointer-events-none",
        button_previous: cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-100 h-7 w-7 p-0 cursor-pointer pointer-events-auto shadow-sm"
        ),
        button_next: cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-100 h-7 w-7 p-0 cursor-pointer pointer-events-auto shadow-sm"
        ),
        month_grid: "w-full border-collapse space-y-1 mt-2",
        weekdays: "flex justify-between",
        weekday: "text-gray-500 w-9 font-medium text-[13px] text-center",
        weeks: "space-y-1 mt-1.5",
        week: "flex w-full justify-between",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-normal transition-colors hover:bg-gray-100 h-9 w-9 p-0 rounded-lg cursor-pointer"
        ),
        selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white rounded-lg font-medium",
        today: "bg-gray-100 text-gray-900 font-semibold rounded-lg",
        outside: "text-gray-400 opacity-50",
        disabled: "text-gray-400 opacity-30",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
