"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/[courseId]/exams/page",{

/***/ "(app-pages-browser)/./src/app/[courseId]/exams/page.tsx":
/*!*******************************************!*\
  !*** ./src/app/[courseId]/exams/page.tsx ***!
  \*******************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n// \"use client\";\n// import { useState } from \"react\";\n// import FormModal from \"@/components/FormModal\"; // Import FormModal\n// import ExamForm from \"@/components/forms/ExamForm\"; // Import ExamForm\n// const ExamsPage = ({ params }: { params: { courseId: string } }) => {\n//   const { courseId } = params; // Access the courseId from params\n//   const [isFormVisible, setFormVisible] = useState(false);\n//   const handleGenerateExam = () => {\n//     setFormVisible(true); // Show the form when the button is clicked\n//   };\n//   const handleCloseForm = () => {\n//     setFormVisible(false); // Close the form when the modal is closed\n//   };\n//   const handleSubmitExam = (examData: any) => {\n//     console.log(\"Exam Data Submitted:\", examData);\n//     // Here, you can send the exam data to your server or handle it as needed\n//     setFormVisible(false); // Optionally close the form after submission\n//   };\n//   return (\n//     <div className=\"p-6 bg-white shadow-md rounded-lg\">\n//       <h1 className=\"text-xl font-semibold mb-4\">Exams for Course</h1>\n//       <button\n//         onClick={handleGenerateExam}\n//         className=\"bg-blue-500 text-white py-2 px-4 rounded-md mb-4\"\n//       >\n//         Generate a New Exam\n//       </button>\n//       {/* Display FormModal with ExamForm inside when isFormVisible is true */}\n//       {isFormVisible && (\n//         <FormModal title=\"Create a New Exam\" onClose={handleCloseForm}>\n//           {/* Pass the courseId as a prop to ExamForm */}\n//           <ExamForm onSubmit={handleSubmitExam} courseId={courseId} />\n//         </FormModal>\n//       )}\n//     </div>\n//   );\n// };\n// export default ExamsPage;\n// [courseId]/exams/page.tsx\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n// [courseId]/exams/page.tsx\n\nconst ExamPage = (param)=>{\n    let { params } = param;\n    _s();\n    const { courseId } = params;\n    const [exam, setExam] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (!courseId) return;\n        const fetchExam = async ()=>{\n            setLoading(true);\n            try {\n                const response = await fetch(\"/api/courses/\".concat(courseId, \"/exam\"));\n                if (!response.ok) {\n                    throw new Error(\"Failed to fetch exam data\");\n                }\n                const data = await response.json();\n                setExam(data);\n            } catch (err) {\n                setError(err instanceof Error ? err.message : \"Unknown error\");\n            } finally{\n                setLoading(false);\n            }\n        };\n        fetchExam();\n    }, [\n        courseId\n    ]);\n    if (loading) return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n        children: \"Loading...\"\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n        lineNumber: 86,\n        columnNumber: 23\n    }, undefined);\n    if (error) return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n        children: [\n            \"Error: \",\n            error\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n        lineNumber: 87,\n        columnNumber: 21\n    }, undefined);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: exam ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                    children: [\n                        \"Exam Topic: \",\n                        exam.exam_topic\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                    lineNumber: 93,\n                    columnNumber: 11\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                    children: [\n                        \"Course ID: \",\n                        exam.course\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                    lineNumber: 94,\n                    columnNumber: 11\n                }, undefined),\n                exam.sections.map((section)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                children: [\n                                    \"Section \",\n                                    section.section_number,\n                                    \": \",\n                                    section.section_title\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                lineNumber: 97,\n                                columnNumber: 15\n                            }, undefined),\n                            section.questions.map((question)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"strong\", {\n                                                    children: [\n                                                        \"Question \",\n                                                        question.question_number,\n                                                        \":\"\n                                                    ]\n                                                }, void 0, true, {\n                                                    fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                                    lineNumber: 103,\n                                                    columnNumber: 21\n                                                }, undefined),\n                                                \" \",\n                                                question.question\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                            lineNumber: 102,\n                                            columnNumber: 19\n                                        }, undefined),\n                                        question.choices && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                                            children: question.choices.map((choice, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                    children: choice\n                                                }, index, false, {\n                                                    fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                                    lineNumber: 109,\n                                                    columnNumber: 25\n                                                }, undefined))\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                            lineNumber: 107,\n                                            columnNumber: 21\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"strong\", {\n                                                    children: \"Model Answer:\"\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                                    lineNumber: 114,\n                                                    columnNumber: 21\n                                                }, undefined),\n                                                \" \",\n                                                question.model_answer\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                            lineNumber: 113,\n                                            columnNumber: 19\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"strong\", {\n                                                children: \"Grading Criteria:\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                                lineNumber: 117,\n                                                columnNumber: 21\n                                            }, undefined)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                            lineNumber: 116,\n                                            columnNumber: 19\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                                            children: question.grading_criteria.map((criteria, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                    children: criteria.criteria\n                                                }, index, false, {\n                                                    fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                                    lineNumber: 121,\n                                                    columnNumber: 23\n                                                }, undefined))\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                            lineNumber: 119,\n                                            columnNumber: 19\n                                        }, undefined)\n                                    ]\n                                }, question._id, true, {\n                                    fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                                    lineNumber: 101,\n                                    columnNumber: 17\n                                }, undefined))\n                        ]\n                    }, section._id, true, {\n                        fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n                        lineNumber: 96,\n                        columnNumber: 13\n                    }, undefined))\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n            lineNumber: 92,\n            columnNumber: 9\n        }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n            children: \"No exam data available.\"\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n            lineNumber: 130,\n            columnNumber: 9\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\ok\\\\Desktop\\\\Grad_frontend\\\\Platform\\\\src\\\\app\\\\[courseId]\\\\exams\\\\page.tsx\",\n        lineNumber: 90,\n        columnNumber: 5\n    }, undefined);\n};\n_s(ExamPage, \"D5/we1BzTWOMPvHUW1Rvb15aNp4=\");\n_c = ExamPage;\n/* harmony default export */ __webpack_exports__[\"default\"] = (ExamPage);\nvar _c;\n$RefreshReg$(_c, \"ExamPage\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvW2NvdXJzZUlkXS9leGFtcy9wYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7O0FBQ0EsZ0JBQWdCO0FBRWhCLG9DQUFvQztBQUNwQyxzRUFBc0U7QUFDdEUseUVBQXlFO0FBRXpFLHdFQUF3RTtBQUN4RSxvRUFBb0U7QUFDcEUsNkRBQTZEO0FBRTdELHVDQUF1QztBQUN2Qyx3RUFBd0U7QUFDeEUsT0FBTztBQUVQLG9DQUFvQztBQUNwQyx3RUFBd0U7QUFDeEUsT0FBTztBQUVQLGtEQUFrRDtBQUNsRCxxREFBcUQ7QUFDckQsZ0ZBQWdGO0FBQ2hGLDJFQUEyRTtBQUMzRSxPQUFPO0FBRVAsYUFBYTtBQUNiLDBEQUEwRDtBQUMxRCx5RUFBeUU7QUFDekUsZ0JBQWdCO0FBQ2hCLHVDQUF1QztBQUN2Qyx1RUFBdUU7QUFDdkUsVUFBVTtBQUNWLDhCQUE4QjtBQUM5QixrQkFBa0I7QUFFbEIsa0ZBQWtGO0FBQ2xGLDRCQUE0QjtBQUM1QiwwRUFBMEU7QUFDMUUsNERBQTREO0FBQzVELHlFQUF5RTtBQUN6RSx1QkFBdUI7QUFDdkIsV0FBVztBQUNYLGFBQWE7QUFDYixPQUFPO0FBQ1AsS0FBSztBQUVMLDRCQUE0QjtBQUU1Qiw0QkFBNEI7OztBQUU1Qiw0QkFBNEI7QUFFdUI7QUFJbkQsTUFBTUcsV0FBVztRQUFDLEVBQUVDLE1BQU0sRUFBb0M7O0lBQzVELE1BQU0sRUFBRUMsUUFBUSxFQUFFLEdBQUdEO0lBRXJCLE1BQU0sQ0FBQ0UsTUFBTUMsUUFBUSxHQUFHTCwrQ0FBUUEsQ0FBYztJQUM5QyxNQUFNLENBQUNNLFNBQVNDLFdBQVcsR0FBR1AsK0NBQVFBLENBQVU7SUFDaEQsTUFBTSxDQUFDUSxPQUFPQyxTQUFTLEdBQUdULCtDQUFRQSxDQUFnQjtJQUVsREQsZ0RBQVNBLENBQUM7UUFDUixJQUFJLENBQUNJLFVBQVU7UUFFZixNQUFNTyxZQUFZO1lBQ2hCSCxXQUFXO1lBQ1gsSUFBSTtnQkFDRixNQUFNSSxXQUFXLE1BQU1DLE1BQU0sZ0JBQXlCLE9BQVRULFVBQVM7Z0JBQ3RELElBQUksQ0FBQ1EsU0FBU0UsRUFBRSxFQUFFO29CQUNoQixNQUFNLElBQUlDLE1BQU07Z0JBQ2xCO2dCQUNBLE1BQU1DLE9BQWEsTUFBTUosU0FBU0ssSUFBSTtnQkFDdENYLFFBQVFVO1lBQ1YsRUFBRSxPQUFPRSxLQUFLO2dCQUNaUixTQUFTUSxlQUFlSCxRQUFRRyxJQUFJQyxPQUFPLEdBQUc7WUFDaEQsU0FBVTtnQkFDUlgsV0FBVztZQUNiO1FBQ0Y7UUFFQUc7SUFDRixHQUFHO1FBQUNQO0tBQVM7SUFFYixJQUFJRyxTQUFTLHFCQUFPLDhEQUFDYTtrQkFBRTs7Ozs7O0lBQ3ZCLElBQUlYLE9BQU8scUJBQU8sOERBQUNXOztZQUFFO1lBQVFYOzs7Ozs7O0lBRTdCLHFCQUNFLDhEQUFDWTtrQkFDRWhCLHFCQUNDLDhEQUFDZ0I7OzhCQUNDLDhEQUFDQzs7d0JBQUc7d0JBQWFqQixLQUFLa0IsVUFBVTs7Ozs7Ozs4QkFDaEMsOERBQUNDOzt3QkFBRzt3QkFBWW5CLEtBQUtvQixNQUFNOzs7Ozs7O2dCQUMxQnBCLEtBQUtxQixRQUFRLENBQUNDLEdBQUcsQ0FBQyxDQUFDQyx3QkFDbEIsOERBQUNQOzswQ0FDQyw4REFBQ1E7O29DQUFHO29DQUNPRCxRQUFRRSxjQUFjO29DQUFDO29DQUFHRixRQUFRRyxhQUFhOzs7Ozs7OzRCQUV6REgsUUFBUUksU0FBUyxDQUFDTCxHQUFHLENBQUMsQ0FBQ00seUJBQ3RCLDhEQUFDWjs7c0RBQ0MsOERBQUNEOzs4REFDQyw4REFBQ2M7O3dEQUFPO3dEQUFVRCxTQUFTRSxlQUFlO3dEQUFDOzs7Ozs7O2dEQUFXO2dEQUNyREYsU0FBU0EsUUFBUTs7Ozs7Ozt3Q0FFbkJBLFNBQVNHLE9BQU8sa0JBQ2YsOERBQUNDO3NEQUNFSixTQUFTRyxPQUFPLENBQUNULEdBQUcsQ0FBQyxDQUFDVyxRQUFRQyxzQkFDN0IsOERBQUNDOzhEQUFnQkY7bURBQVJDOzs7Ozs7Ozs7O3NEQUlmLDhEQUFDbkI7OzhEQUNDLDhEQUFDYzs4REFBTzs7Ozs7O2dEQUFzQjtnREFBRUQsU0FBU1EsWUFBWTs7Ozs7OztzREFFdkQsOERBQUNyQjtzREFDQyw0RUFBQ2M7MERBQU87Ozs7Ozs7Ozs7O3NEQUVWLDhEQUFDRztzREFDRUosU0FBU1MsZ0JBQWdCLENBQUNmLEdBQUcsQ0FBQyxDQUFDZ0IsVUFBVUosc0JBQ3hDLDhEQUFDQzs4REFBZ0JHLFNBQVNBLFFBQVE7bURBQXpCSjs7Ozs7Ozs7Ozs7bUNBcEJMTixTQUFTVyxHQUFHOzs7Ozs7dUJBTGhCaEIsUUFBUWdCLEdBQUc7Ozs7Ozs7Ozs7c0NBa0N6Qiw4REFBQ3hCO3NCQUFFOzs7Ozs7Ozs7OztBQUlYO0dBN0VNbEI7S0FBQUE7QUErRU4sK0RBQWVBLFFBQVFBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2FwcC9bY291cnNlSWRdL2V4YW1zL3BhZ2UudHN4PzM2OWQiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8vIFwidXNlIGNsaWVudFwiO1xyXG5cclxuLy8gaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuLy8gaW1wb3J0IEZvcm1Nb2RhbCBmcm9tIFwiQC9jb21wb25lbnRzL0Zvcm1Nb2RhbFwiOyAvLyBJbXBvcnQgRm9ybU1vZGFsXHJcbi8vIGltcG9ydCBFeGFtRm9ybSBmcm9tIFwiQC9jb21wb25lbnRzL2Zvcm1zL0V4YW1Gb3JtXCI7IC8vIEltcG9ydCBFeGFtRm9ybVxyXG5cclxuLy8gY29uc3QgRXhhbXNQYWdlID0gKHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGNvdXJzZUlkOiBzdHJpbmcgfSB9KSA9PiB7XHJcbi8vICAgY29uc3QgeyBjb3Vyc2VJZCB9ID0gcGFyYW1zOyAvLyBBY2Nlc3MgdGhlIGNvdXJzZUlkIGZyb20gcGFyYW1zXHJcbi8vICAgY29uc3QgW2lzRm9ybVZpc2libGUsIHNldEZvcm1WaXNpYmxlXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbi8vICAgY29uc3QgaGFuZGxlR2VuZXJhdGVFeGFtID0gKCkgPT4ge1xyXG4vLyAgICAgc2V0Rm9ybVZpc2libGUodHJ1ZSk7IC8vIFNob3cgdGhlIGZvcm0gd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWRcclxuLy8gICB9O1xyXG5cclxuLy8gICBjb25zdCBoYW5kbGVDbG9zZUZvcm0gPSAoKSA9PiB7XHJcbi8vICAgICBzZXRGb3JtVmlzaWJsZShmYWxzZSk7IC8vIENsb3NlIHRoZSBmb3JtIHdoZW4gdGhlIG1vZGFsIGlzIGNsb3NlZFxyXG4vLyAgIH07XHJcblxyXG4vLyAgIGNvbnN0IGhhbmRsZVN1Ym1pdEV4YW0gPSAoZXhhbURhdGE6IGFueSkgPT4ge1xyXG4vLyAgICAgY29uc29sZS5sb2coXCJFeGFtIERhdGEgU3VibWl0dGVkOlwiLCBleGFtRGF0YSk7XHJcbi8vICAgICAvLyBIZXJlLCB5b3UgY2FuIHNlbmQgdGhlIGV4YW0gZGF0YSB0byB5b3VyIHNlcnZlciBvciBoYW5kbGUgaXQgYXMgbmVlZGVkXHJcbi8vICAgICBzZXRGb3JtVmlzaWJsZShmYWxzZSk7IC8vIE9wdGlvbmFsbHkgY2xvc2UgdGhlIGZvcm0gYWZ0ZXIgc3VibWlzc2lvblxyXG4vLyAgIH07XHJcblxyXG4vLyAgIHJldHVybiAoXHJcbi8vICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBiZy13aGl0ZSBzaGFkb3ctbWQgcm91bmRlZC1sZ1wiPlxyXG4vLyAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LXNlbWlib2xkIG1iLTRcIj5FeGFtcyBmb3IgQ291cnNlPC9oMT5cclxuLy8gICAgICAgPGJ1dHRvblxyXG4vLyAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUdlbmVyYXRlRXhhbX1cclxuLy8gICAgICAgICBjbGFzc05hbWU9XCJiZy1ibHVlLTUwMCB0ZXh0LXdoaXRlIHB5LTIgcHgtNCByb3VuZGVkLW1kIG1iLTRcIlxyXG4vLyAgICAgICA+XHJcbi8vICAgICAgICAgR2VuZXJhdGUgYSBOZXcgRXhhbVxyXG4vLyAgICAgICA8L2J1dHRvbj5cclxuXHJcbi8vICAgICAgIHsvKiBEaXNwbGF5IEZvcm1Nb2RhbCB3aXRoIEV4YW1Gb3JtIGluc2lkZSB3aGVuIGlzRm9ybVZpc2libGUgaXMgdHJ1ZSAqL31cclxuLy8gICAgICAge2lzRm9ybVZpc2libGUgJiYgKFxyXG4vLyAgICAgICAgIDxGb3JtTW9kYWwgdGl0bGU9XCJDcmVhdGUgYSBOZXcgRXhhbVwiIG9uQ2xvc2U9e2hhbmRsZUNsb3NlRm9ybX0+XHJcbi8vICAgICAgICAgICB7LyogUGFzcyB0aGUgY291cnNlSWQgYXMgYSBwcm9wIHRvIEV4YW1Gb3JtICovfVxyXG4vLyAgICAgICAgICAgPEV4YW1Gb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXRFeGFtfSBjb3Vyc2VJZD17Y291cnNlSWR9IC8+XHJcbi8vICAgICAgICAgPC9Gb3JtTW9kYWw+XHJcbi8vICAgICAgICl9XHJcbi8vICAgICA8L2Rpdj5cclxuLy8gICApO1xyXG4vLyB9O1xyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgRXhhbXNQYWdlO1xyXG5cclxuLy8gW2NvdXJzZUlkXS9leGFtcy9wYWdlLnRzeFxyXG5cInVzZSBjbGllbnRcIjtcclxuLy8gW2NvdXJzZUlkXS9leGFtcy9wYWdlLnRzeFxyXG5cclxuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVNlYXJjaFBhcmFtcyB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IEV4YW0gfSBmcm9tICcuLi8uLi8uLi90eXBlcy9leGFtJztcclxuXHJcbmNvbnN0IEV4YW1QYWdlID0gKHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGNvdXJzZUlkOiBzdHJpbmcgfSB9KSA9PiB7XHJcbiAgY29uc3QgeyBjb3Vyc2VJZCB9ID0gcGFyYW1zO1xyXG5cclxuICBjb25zdCBbZXhhbSwgc2V0RXhhbV0gPSB1c2VTdGF0ZTxFeGFtIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGU8Ym9vbGVhbj4odHJ1ZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghY291cnNlSWQpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBmZXRjaEV4YW0gPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9jb3Vyc2VzLyR7Y291cnNlSWR9L2V4YW1gKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBleGFtIGRhdGEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZGF0YTogRXhhbSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBzZXRFeGFtKGRhdGEpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBzZXRFcnJvcihlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmZXRjaEV4YW0oKTtcclxuICB9LCBbY291cnNlSWRdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHJldHVybiA8cD5Mb2FkaW5nLi4uPC9wPjtcclxuICBpZiAoZXJyb3IpIHJldHVybiA8cD5FcnJvcjoge2Vycm9yfTwvcD47XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICB7ZXhhbSA/IChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGgxPkV4YW0gVG9waWM6IHtleGFtLmV4YW1fdG9waWN9PC9oMT5cclxuICAgICAgICAgIDxoMj5Db3Vyc2UgSUQ6IHtleGFtLmNvdXJzZX08L2gyPlxyXG4gICAgICAgICAge2V4YW0uc2VjdGlvbnMubWFwKChzZWN0aW9uKSA9PiAoXHJcbiAgICAgICAgICAgIDxkaXYga2V5PXtzZWN0aW9uLl9pZH0+XHJcbiAgICAgICAgICAgICAgPGgzPlxyXG4gICAgICAgICAgICAgICAgU2VjdGlvbiB7c2VjdGlvbi5zZWN0aW9uX251bWJlcn06IHtzZWN0aW9uLnNlY3Rpb25fdGl0bGV9XHJcbiAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICB7c2VjdGlvbi5xdWVzdGlvbnMubWFwKChxdWVzdGlvbikgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e3F1ZXN0aW9uLl9pZH0+XHJcbiAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+UXVlc3Rpb24ge3F1ZXN0aW9uLnF1ZXN0aW9uX251bWJlcn06PC9zdHJvbmc+eycgJ31cclxuICAgICAgICAgICAgICAgICAgICB7cXVlc3Rpb24ucXVlc3Rpb259XHJcbiAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAge3F1ZXN0aW9uLmNob2ljZXMgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgIHtxdWVzdGlvbi5jaG9pY2VzLm1hcCgoY2hvaWNlLCBpbmRleCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXtpbmRleH0+e2Nob2ljZX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5Nb2RlbCBBbnN3ZXI6PC9zdHJvbmc+IHtxdWVzdGlvbi5tb2RlbF9hbnN3ZXJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5HcmFkaW5nIENyaXRlcmlhOjwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICB7cXVlc3Rpb24uZ3JhZGluZ19jcml0ZXJpYS5tYXAoKGNyaXRlcmlhLCBpbmRleCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17aW5kZXh9Pntjcml0ZXJpYS5jcml0ZXJpYX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICkgOiAoXHJcbiAgICAgICAgPHA+Tm8gZXhhbSBkYXRhIGF2YWlsYWJsZS48L3A+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXhhbVBhZ2U7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJFeGFtUGFnZSIsInBhcmFtcyIsImNvdXJzZUlkIiwiZXhhbSIsInNldEV4YW0iLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImVycm9yIiwic2V0RXJyb3IiLCJmZXRjaEV4YW0iLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJFcnJvciIsImRhdGEiLCJqc29uIiwiZXJyIiwibWVzc2FnZSIsInAiLCJkaXYiLCJoMSIsImV4YW1fdG9waWMiLCJoMiIsImNvdXJzZSIsInNlY3Rpb25zIiwibWFwIiwic2VjdGlvbiIsImgzIiwic2VjdGlvbl9udW1iZXIiLCJzZWN0aW9uX3RpdGxlIiwicXVlc3Rpb25zIiwicXVlc3Rpb24iLCJzdHJvbmciLCJxdWVzdGlvbl9udW1iZXIiLCJjaG9pY2VzIiwidWwiLCJjaG9pY2UiLCJpbmRleCIsImxpIiwibW9kZWxfYW5zd2VyIiwiZ3JhZGluZ19jcml0ZXJpYSIsImNyaXRlcmlhIiwiX2lkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/[courseId]/exams/page.tsx\n"));

/***/ })

});